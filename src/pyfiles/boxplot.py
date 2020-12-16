import plotly.graph_objects as go
import numpy as np

rastringin = [
  [-327.51, -327.02, -326.12, -328.04, -326.95, -327.99, -327.5, -326.59, -327.11, -327.51],
  [-327.61, -326.84, -325.25, -327.43, -327.29, -326.68, -328.35, -325.94, -328.13, -326.13],
  # [-328.51, -328.47, -328.62, -328.67, -327.46, -328.51, -327.47, -328.34, -328.25, -327.97],
  # [-113.89, -99.715, -127.23, -166.96, -130.43, -195.51, -177.75, -132.39, -174.43, -95.645],
  # [174.75, 65.569, 88.320, 30.607, 135.21, 200.41, 152.79, 34.273, 33.141, 133.35],
]


data = rastringin


fig = go.Figure()
fig.add_trace(go.Box(y=data[0], name= 'Hill Climbing'))
fig.add_trace(go.Box(y=data[1], name= 'Simulated Annealing'))
# fig.add_trace(go.Box(y=data[2], name= 'GA with Elitism'))
# fig.add_trace(go.Box(y=data[3], name= 'PSO'))

fig.update_layout(title='Rastringin', title_x=0.5, showlegend=False)
fig.show()