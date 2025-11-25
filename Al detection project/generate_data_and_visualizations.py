"""
Responsible AI Bias Audit: COVID-19 South Africa
Data Generation and Visualization Script

This script generates synthetic COVID-19 data for South Africa and creates
visualizations for the bias audit report.
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# Set random seed for reproducibility
np.random.seed(42)

# Configuration
S