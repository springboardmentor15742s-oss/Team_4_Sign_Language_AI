"""
Milestone 4 - ML Model Training Script
SignLearn AI | Team 4 | Infosys Springboard 2026

Trains a RandomForest classifier on synthetic MediaPipe 21-landmark data.
Each sample: 63 floats (21 landmarks * x,y,z) -> sign label

Usage:
    python ml/train_classifier.py

Output:
    ml/model/sign_classifier.pkl
    ml/model/label_encoder.pkl  
    ml/model/training_report.txt
"""

import os, math, random, pickle, json
from pathlib import Path

try:
    import numpy as np
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.preprocessing import LabelEncoder, StandardScaler
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.metrics import classification_report, accuracy_score
    from sklearn.pipeline import Pipeline
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    print("WARNING: scikit-learn not installed. Run: pip install scikit-learn numpy")

SIGNS = ['A','B','C','D','E','F','HELLO','THANK_YOU','YES','NO','PLEASE','I','L','O','W','Y']
N_SAMPLES_PER_SIGN = 500
NOISE_STD = 0.012
MODEL_DIR = Path(__file__).parent / "model"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

def _pt(x, y, z=0.0):
    return [x + random.gauss(0, NOISE_STD), y + random.gauss(0, NOISE_STD), z + random.gauss(0, 0.005)]

def generate_landmarks(sign):
    wx, wy = 0.5, 0.75
    def closed(bx, by):
        return [_pt(bx, by), _pt(bx, by-0.04), _pt(bx, by-0.07), _pt(bx+0.01, by-0.05)]
    def opened(bx, by, dy=0.22):
        return [_pt(bx, by), _pt(bx, by-0.07), _pt(bx, by-0.14), _pt(bx, by-dy)]
    
    lm = [_pt(wx, wy, 0.0)]  # wrist
    if sign == 'A':
        lm += [_pt(wx-0.07,wy-0.04),_pt(wx-0.10,wy-0.08),_pt(wx-0.10,wy-0.12),_pt(wx-0.09,wy-0.09)]
        for dx in [-0.04,0.0,0.04,0.08]: lm += closed(wx+dx, wy-0.12)
    elif sign == 'B':
        lm += [_pt(wx-0.07,wy-0.05),_pt(wx-0.09,wy-0.09),_pt(wx-0.09,wy-0.12),_pt(wx-0.07,wy-0.11)]
        for dx in [-0.04,0.0,0.04,0.08]: lm += opened(wx+dx, wy-0.13)
    elif sign == 'D':
        lm += [_pt(wx-0.07,wy-0.04)]*4
        lm += opened(wx-0.04, wy-0.13, 0.24)
        for dx in [0.01,0.05,0.09]: lm += closed(wx+dx, wy-0.12)
    elif sign == 'F':
        lm += [_pt(wx-0.04,wy-0.17)]*4  # thumb to index tip
        lm += [_pt(wx-0.04,wy-0.13),_pt(wx-0.04,wy-0.16),_pt(wx-0.04,wy-0.19),_pt(wx-0.04,wy-0.17)]
        for dx in [0.01,0.05,0.09]: lm += opened(wx+dx, wy-0.13)
    elif sign in ('HELLO','PLEASE'):
        lm += [_pt(wx-0.14,wy-0.06),_pt(wx-0.17,wy-0.11),_pt(wx-0.18,wy-0.16),_pt(wx-0.18,wy-0.21)]
        for dx in [-0.05,0.0,0.05,0.10]: lm += opened(wx+dx, wy-0.13)
    elif sign == 'THANK_YOU':
        lm += [_pt(wx-0.05,wy-0.04)]*4
        for dx in [-0.03,0.01,0.05,0.09]:
            lm += [_pt(wx+dx,wy-0.13),_pt(wx+dx,wy-0.18),_pt(wx+dx,wy-0.22),_pt(wx+dx,wy-0.26)]
    else:
        random.seed(hash(sign) % 9999)
        lm += [_pt(wx+random.uniform(-0.1,0.02), wy-random.uniform(0.03,0.08))]*4
        for dx in [-0.04,0.0,0.04,0.08]:
            lm += opened(wx+dx,wy-0.12) if random.random()>0.5 else closed(wx+dx,wy-0.12)
        random.seed()
    while len(lm) < 21: lm.append(_pt(wx, wy-0.1))
    flat = []
    for pt in lm[:21]: flat.extend(pt[:3])
    return flat[:63]

def add_features(X):
    out = []
    for s in X:
        pts = [(s[i],s[i+1],s[i+2]) for i in range(0,63,3)]
        w = pts[0]
        d3 = lambda a,b: math.sqrt(sum((a[i]-b[i])**2 for i in range(3)))
        tips=[pts[4],pts[8],pts[12],pts[16],pts[20]]
        knk=[pts[2],pts[5],pts[9],pts[13],pts[17]]
        tdist=[d3(t,w) for t in tips]
        kdist=[d3(k,w) for k in knk]
        ratios=[tdist[i]/(kdist[i]+1e-6) for i in range(5)]
        extra=tdist+kdist+ratios+[d3(pts[8],pts[4]),d3(pts[4],pts[5]),d3(pts[20],pts[8])]
        out.append(s+extra)
    return out

def train():
    if not SKLEARN_AVAILABLE:
        print("Cannot train: install scikit-learn numpy first")
        return False
    random.seed(42)
    X_raw,y=[],[]
    print(f"Generating {N_SAMPLES_PER_SIGN*len(SIGNS)} samples...")
    for sign in SIGNS:
        for _ in range(N_SAMPLES_PER_SIGN):
            X_raw.append(generate_landmarks(sign)); y.append(sign)
    X=add_features(X_raw)
    Xnp=np.array(X,dtype=np.float32); le=LabelEncoder(); yenc=le.fit_transform(y)
    Xtr,Xte,ytr,yte=train_test_split(Xnp,yenc,test_size=0.2,random_state=42,stratify=yenc)
    print(f"Training RandomForest on {len(Xtr)} samples...")
    pipe=Pipeline([('sc',StandardScaler()),('clf',RandomForestClassifier(n_estimators=200,max_depth=20,class_weight='balanced',random_state=42,n_jobs=-1))])
    pipe.fit(Xtr,ytr)
    acc=accuracy_score(yte,pipe.predict(Xte))
    rep=classification_report(yte,pipe.predict(Xte),target_names=le.classes_)
    print(f"Test Accuracy: {acc*100:.1f}%\n{rep}")
    with open(MODEL_DIR/"sign_classifier.pkl",'wb') as f: pickle.dump(pipe,f)
    with open(MODEL_DIR/"label_encoder.pkl",'wb') as f: pickle.dump(le,f)
    json.dump({"signs":list(le.classes_),"test_accuracy":round(acc*100,1),"n_features":Xnp.shape[1]},open(MODEL_DIR/"model_metadata.json",'w'),indent=2)
    print(f"Model saved to {MODEL_DIR}/sign_classifier.pkl")
    return True

if __name__=="__main__":
    train()
