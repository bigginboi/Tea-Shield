# 🌱 TEA-SHIELD  
### Offline-First Tea Leaf Disease Detection & Decision Support System

TEA-SHIELD is a **mobile-first, offline-capable web application** designed to help **tea farmers and field workers in Assam** detect tea leaf diseases accurately and take the **right action at the right time**.

The app focuses on **accuracy, trust, and usability**, avoiding blind AI guesses and prioritizing explainable, stable results.

---

## 🚀 Problem Statement

Tea farmers often face:
- Late detection of leaf diseases
- Confusing or unreliable diagnostic tools
- Lack of expert access in remote areas
- Language and digital literacy barriers
- Poor internet connectivity in the field

Wrong or delayed decisions can lead to **rapid disease spread and yield loss**.

---

## ✅ Solution Overview

TEA-SHIELD provides:
- **Accurate tea leaf disease detection**
- **Confidence-aware recommendations**
- **Offline-first operation**
- **Multilingual, farmer-friendly UI**
- **Clear step-by-step guidance**

The system is designed as a **decision-support tool**, not a blind automation system.

---

## 🦠 Supported Diseases

The app detects **only the following diseases**:

- Red Rust  
- Brown Blight  
- Blister / White Blight  
- Healthy Leaf  

> The system never invents disease names and avoids confident wrong predictions.

---

## 📸 Image Input Options

- 📷 Real-time camera capture (mobile & laptop)
- 📂 Upload image from device (gallery / file picker)

Users can easily switch between camera and upload modes.

---

## 🧠 Disease Analysis Approach (Accuracy First)

To ensure **stable and correct results**, TEA-SHIELD uses a **deterministic, explainable pipeline**:

### Key Principles
- Leaf isolation (background ignored)
- HSV/LAB color-space analysis (not raw RGB)
- Non-overlapping disease rules
- Scoring-based classification (no first-match logic)
- Uncertainty handling (“Recheck image” when needed)

> Accuracy and trust are prioritized over flashy AI claims.

---

## 📊 Severity & Confidence

### Severity
- Pixel-based calculation
- Percentage of affected leaf area
- Classified as:
  - 🟢 Low
  - 🟡 Medium
  - 🔴 High

### Confidence
- Calculated from:
  - Rule dominance
  - Signal consistency
  - Image quality
- Displayed as a percentage

---

## 🎯 Confidence-Based Action Advice

Recommendations change based on confidence:

- **High confidence** → Act immediately  
- **Medium confidence** → Recheck in 2–3 days  
- **Low confidence** → Take another photo or consult an expert  

This prevents **wrong-but-confident actions**.

---

## ⚠️ Disease Progression Warning

The app warns users about **possible disease spread** if left untreated, helping encourage **early intervention**.

---

## 🧠 “Why This Happened” Insight

Each diagnosis includes a simple explanation of **possible causes**, such as:
- High humidity
- Poor air circulation
- Delayed pruning

This helps farmers **prevent recurrence**, not just treat symptoms.

---

## 🌍 Language Support (Offline)

TEA-SHIELD supports **three languages**, fully offline:

- English  
- Assamese  
- Hindi  

A single toggle cycles through:
