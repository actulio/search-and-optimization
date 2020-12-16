import plotly.express as px
import plotly.graph_objects as go
import numpy as np
from numpy import loadtxt

import json

# with open('src/pyfiles/out.json') as json_file:
#   data = json.load(json_file)

data = loadtxt("src/tests/dtlz1/dtlz1_fitness.txt", comments="#", delimiter="\n", unpack=False)

print(data)

# data = [
#   [-449.08, -448.84, -448.93, -448.81, -448.61, -448.74, -448.85, -448.65, -448.92, -448.69],
#   [-448.32, -447.73, -447.3 6, -448.65, -448.15, -447.16, -448.42, -448.23, -448.45, -448.89],
#   [-448.32, -447.73, -447.36, -448.65, -448.15, -447.16, -448.42, -448.23, -448.45, -448.8],
# ]

# df = px.data.tips()
# fig = px.box(df, x="Quality", y="total_bill")
# fig.show()

# print(data.size)

# x = np.linspace(0, data.size, data.size)

# minElement = np.amin(data)
# minIndex = np.where(data == np.amin(data))[0][0]

# fig = go.Figure(data=go.Scatter(x=x, y=data))

# fig.update_layout(title='Hill Climbing',  title_x=0.5,
#                    xaxis_title='Execuções do Loop mais externo ({})'.format(data.size),
#                    yaxis_title='Qualidade (Ackley)')

# fig.add_annotation(x=minIndex, y=minElement,
#             text='Min value {}'.format(round(minElement,  2)),
#             showarrow=True,
#             arrowhead=1)



# fig.show()
# fig = go.Figure()
# # fig.add_trace(go.Box(y=data, name= 'Bounded Uniform Convolution', boxpoints= 'all'))
# fig.add_trace(go.Box(y=data[0], name= 'Hill Climbing'))
# fig.add_trace(go.Box(y=data[1], name= 'Simulated Annealing'))
# fig.add_trace(go.Box(y=data[2], name= 'Feature-Based Tabu Search'))

# fig.show()