# 肥胖风险多分类预测项目

> 一个完整的机器学习教学项目，用于预测个人的肥胖风险等级

---

## 目录

- [快速入门](#快速入门)
- [项目概述](#项目概述)
- [项目结构](#项目结构)
- [核心模块详解](#核心模块详解)
- [机器学习流程详解](#机器学习流程详解)
- [常见问题](#常见问题)
- [进阶技巧](#进阶技巧)

---

## 快速入门

### 1. 环境准备

```bash
# 创建虚拟环境（推荐）
conda create -n obesity python=3.9
conda activate obesity

# 安装依赖
pip install -r requirements.txt
```

### 2. 准备数据

从 [Kaggle竞赛页面](https://www.kaggle.com/competitions/playground-series-s4e2/data) 下载数据，放到 `data/` 目录：

```
data/
├── train.csv
├── test.csv
└── sample_submission.csv
```

### 3. 运行项目

```bash
# 完整流程
python run.py

# 只进行数据探索
python run.py --explore-only

# 快速训练（跳过交叉验证）
python run.py --skip-cv

# 保存模型
python run.py --save-model
```

### 4. 查看结果

- 提交文件: `submissions/submission_*.csv`
- 日志文件: `logs/training.log`
- 可视化图表: `logs/*.png`

---

## 项目概述

### 竞赛目标

使用各种因素预测个人的肥胖风险等级（与心血管疾病相关）

### 评估指标

**准确率 (Accuracy)** = 正确预测的样本数 / 总样本数

### 目标类别 (7个)

| 类别 | 中文含义 |
|------|----------|
| Insufficient_Weight | 体重不足 |
| Normal_Weight | 正常体重 |
| Overweight_Level_I | 超重I级 |
| Overweight_Level_II | 超重II级 |
| Obesity_Type_I | 肥胖I型 |
| Obesity_Type_II | 肥胖II型 |
| Obesity_Type_III | 肥胖III型 |

### 数据特点

- 训练集: 约20,000条记录
- 测试集: 约10,000条记录
- 特征数: 16个原始特征
- 目标类别: 7个肥胖等级

---

## 项目结构

```
obesity_risk_project/
├── data/                       # 数据目录
│   ├── train.csv              # 训练数据
│   ├── test.csv               # 测试数据
│   └── sample_submission.csv  # 提交样例
│
├── src/                        # 源代码目录
│   ├── config.py              # 配置文件
│   ├── data_loader.py         # 数据加载模块
│   ├── feature_engineering.py # 特征工程模块
│   ├── model_trainer.py       # 模型训练模块
│   ├── validation.py          # 验证评估模块
│   ├── predictor.py           # 预测提交模块
│   └── main.py                # 主程序入口
│
├── models/                     # 保存的模型
├── submissions/                # 提交文件
├── logs/                       # 日志和图表
├── notebooks/                  # Jupyter notebooks
├── tests/                      # 测试代码
│
├── run.py                      # 项目启动脚本
├── requirements.txt            # 依赖包
└── README.md                   # 项目说明
```

---

## 核心模块详解

### 1. config.py - 配置文件

**作用**: 集中管理所有项目参数

```python
# 路径配置
BASE_DIR      # 项目根目录
DATA_DIR      # 数据目录
TRAIN_PATH    # 训练数据路径
TEST_PATH     # 测试数据路径

# 输出目录
MODELS_DIR       # 模型保存目录
SUBMISSIONS_DIR  # 提交文件目录
LOGS_DIR         # 日志目录

# 数据配置
TARGET_COL    # 目标列名 'NObeyesdad'
ID_COL        # ID列名 'id'
RANDOM_STATE  # 随机种子 42
```

### 2. data_loader.py - 数据加载模块

**核心类**: `DataLoader`

```python
from data_loader import DataLoader

loader = DataLoader('data/train.csv', 'data/test.csv', 'NObeyesdad')
train_df, test_df = loader.load_data()

# 数据探索
loader.get_basic_info()           # 获取基本信息
loader.check_data_quality()       # 检查数据质量
loader.plot_target_distribution() # 绘制目标分布
```

### 3. feature_engineering.py - 特征工程模块

**核心类**: `FeatureEngineer`

```python
from feature_engineering import FeatureEngineer

engineer = FeatureEngineer()
X_train, X_test, y_train = engineer.prepare_features(
    train_df, test_df, 'NObeyesdad', 'id'
)
```

**创建的新特征**:

| 特征名 | 计算方式 | 说明 |
|--------|----------|------|
| BMI | Weight / Height² | 身体质量指数 |
| BMI_Category | 根据BMI分组 | 体重分类 |
| Age_Group | 根据年龄分组 | 年龄段 |
| Lifestyle_Score | (FAF×2 + (3-TUE) + CH2O) / 3 | 生活方式评分 |
| Diet_Score | 综合饮食相关特征 | 饮食习惯评分 |
| Age_BMI | Age × BMI | 年龄与BMI交互 |
| Weight_Activity | Weight × FAF | 体重与运动交互 |

### 4. model_trainer.py - 模型训练模块

**核心类**: `ModelTrainer`

```python
from model_trainer import ModelTrainer

# 创建训练器
trainer = ModelTrainer(
    model_params={'n_estimators': 100, 'max_depth': 6},
    use_early_stopping=True,
    early_stopping_rounds=50
)

# 训练模型
trainer.train(X_train, y_train, X_val, y_val)

# 预测
predictions = trainer.predict(X_test)

# 获取特征重要性
importance = trainer.get_feature_importance()
```

### 5. validation.py - 验证评估模块

**核心函数**: `train_val_split`, `cross_validate`

```python
from validation import train_val_split, cross_validate

# 划分数据集
X_train, X_val, y_train, y_val = train_val_split(X, y, test_size=0.2)

# 交叉验证
scores = cross_validate(X, y, model_params, n_splits=5)
```

### 6. predictor.py - 预测提交模块

**核心类**: `Predictor`

```python
from predictor import Predictor

predictor = Predictor(trainer, label_encoder)
submission = predictor.predict_and_submit(X_test, test_ids, 'submissions')
```

---

## 机器学习流程详解

### 阶段1: 数据探索 (EDA)

```python
# 1. 加载数据
train_df = pd.read_csv('train.csv')

# 2. 查看基本信息
print(train_df.shape)      # (行数, 列数)
print(train_df.info())     # 数据类型
print(train_df.describe()) # 统计描述

# 3. 检查数据质量
print(train_df.isnull().sum())    # 缺失值
print(train_df.duplicated().sum()) # 重复值

# 4. 探索目标变量
print(train_df['NObeyesdad'].value_counts())
```

### 阶段2: 数据划分

```
原始数据
    │
    ├──► 训练集 (70-80%) ──► 用于训练模型参数
    │
    ├──► 验证集 (10-15%) ──► 用于调参和早停
    │
    └──► 测试集 (10-15%) ──► 用于最终评估
```

```python
from sklearn.model_selection import train_test_split

X_train, X_val, y_train, y_val = train_test_split(
    X, y, 
    test_size=0.2,        # 20%作为验证集
    random_state=42,      # 保证可重复
    stratify=y            # 保持类别比例
)
```

### 阶段3: 特征工程

```python
# 1. BMI (身体质量指数)
df['BMI'] = df['Weight'] / (df['Height'] ** 2)

# 2. 生活方式评分
df['Lifestyle_Score'] = (
    df['FAF'] * 2 +       # 体育活动频率
    (3 - df['TUE']) +     # 技术使用时间
    df['CH2O']            # 饮水量
) / 3

# 3. 交互特征
df['Age_BMI'] = df['Age'] * df['BMI']
df['Weight_Activity'] = df['Weight'] * df['FAF']

# 4. 特征编码
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
df['Gender_encoded'] = le.fit_transform(df['Gender'])

# 5. 特征缩放
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
```

### 阶段4: 模型训练

```python
import xgboost as xgb

# 创建模型
model = xgb.XGBClassifier(
    n_estimators=1000,
    learning_rate=0.05,
    max_depth=6,
    objective='multi:softprob',
    random_state=42
)

# 带早停的训练
model.fit(
    X_train, y_train,
    eval_set=[(X_val, y_val)],
    early_stopping_rounds=50,
    verbose=False
)
```

**早停原理**:

```
验证集准确率
    │
1.0 ┤                    ╭────── 过拟合开始
    │                 ╭──╯
0.9 ┤              ╭──╯
    │           ╭──╯
0.8 ┤        ╭──╯
    │     ╭──╯
0.7 ┤  ╭──╯
    │╭─╯
0.6 ┤╯
    └────┬────┬────┬────┬────┬────┬────┬────► 迭代次数
         100  200  300  400  500  600  700
              ↑
         最佳迭代点（早停）
```

### 阶段5: 模型评估

```python
from sklearn.metrics import accuracy_score, classification_report

# 预测
y_pred = model.predict(X_val)

# 准确率
accuracy = accuracy_score(y_val, y_pred)
print(f"准确率: {accuracy:.4f}")

# 详细报告
print(classification_report(y_val, y_pred))
```

### 阶段6: 生成提交

```python
# 1. 预测测试集
predictions = model.predict(X_test)

# 2. 创建提交文件
submission = pd.DataFrame({
    'id': test_df['id'],
    'NObeyesdad': predictions
})

# 3. 保存
submission.to_csv('submission.csv', index=False)
```

---

## 数据字典

| 特征名 | 说明 | 类型 |
|--------|------|------|
| Gender | 性别 | 分类 |
| Age | 年龄 | 数值 |
| Height | 身高(米) | 数值 |
| Weight | 体重(公斤) | 数值 |
| family_history_with_overweight | 家族肥胖史 | 分类 |
| FAVC | 频繁摄入高热量食物 | 分类 |
| FCVC | 蔬菜摄入频率 | 数值 |
| NCP | 主餐数量 | 数值 |
| CAEC | 餐间进食 | 分类 |
| SMOKE | 是否吸烟 | 分类 |
| CH2O | 每日饮水量 | 数值 |
| SCC | 卡路里监测 | 分类 |
| FAF | 体育活动频率 | 数值 |
| TUE | 使用技术设备时间 | 数值 |
| CALC | 饮酒 | 分类 |
| MTRANS | 交通方式 | 分类 |

---

## 常见问题

### Q1: 运行时报错 "ModuleNotFoundError"

```bash
pip install -r requirements.txt
```

### Q2: 如何提高分数？

1. **特征工程**: 创建更多有意义的特征
2. **超参数调优**: 使用Optuna进行自动调参
3. **模型集成**: 组合多个模型的预测
4. **交叉验证**: 使用更多折数

### Q3: 为什么验证集分数比训练集低很多？

**原因**: 过拟合 - 模型记住了训练数据

**解决**:
- 使用正则化
- 减少模型复杂度
- 使用早停机制

### Q4: 内存不足怎么办？

1. 减少交叉验证折数: `--n-folds 3`
2. 减少特征数量
3. 使用更小的batch_size

---

## 进阶技巧

### 技巧1: 超参数调优

```python
import optuna

def objective(trial):
    params = {
        'n_estimators': trial.suggest_int('n_estimators', 100, 2000),
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
        'max_depth': trial.suggest_int('max_depth', 3, 10),
    }
    
    model = xgb.XGBClassifier(**params)
    scores = cross_val_score(model, X_train, y_train, cv=5)
    return scores.mean()

study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100)
print(f"最佳参数: {study.best_params}")
```

### 技巧2: 模型集成

```python
# 训练多个模型
models = {
    'xgb': xgb.XGBClassifier(**xgb_params),
    'lgb': lgb.LGBMClassifier(**lgb_params),
}

# 加权平均预测
predictions = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    predictions[name] = model.predict_proba(X_test)

ensemble_pred = 0.5 * predictions['xgb'] + 0.5 * predictions['lgb']
final_pred = np.argmax(ensemble_pred, axis=1)
```

### 技巧3: 特征重要性分析

```python
import matplotlib.pyplot as plt
import seaborn as sns

importance = model.feature_importances_
feature_importance = pd.DataFrame({
    'feature': X_train.columns,
    'importance': importance
}).sort_values('importance', ascending=False)

plt.figure(figsize=(10, 8))
sns.barplot(x='importance', y='feature', data=feature_importance.head(20))
plt.title('Top 20 Feature Importance')
plt.show()
```

---

## 参考资料

- [Kaggle竞赛页面](https://www.kaggle.com/competitions/playground-series-s4e2)
- [XGBoost文档](https://xgboost.readthedocs.io/)
- [Scikit-learn文档](https://scikit-learn.org/)

---

## 许可证

MIT License
