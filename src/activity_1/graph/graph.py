import plotly.express as px
import plotly.graph_objects as go
import json

# with open('../out/out.json') as json_file:
#   data = json.load(json_file)

data = [
  [-449.08, -448.84, -448.93, -448.81, -448.61, -448.74, -448.85, -448.65, -448.92, -448.69],
  [-448.32, -447.73, -447.36, -448.65, -448.15, -447.16, -448.42, -448.23, -448.45, -448.89],
  [-448.32, -447.73, -447.36, -448.65, -448.15, -447.16, -448.42, -448.23, -448.45, -448.8],
]

# df = px.data.tips()
# fig = px.box(df, x="Quality", y="total_bill")
# fig.show()

fig = go.Figure()
# fig.add_trace(go.Box(y=data, name= 'Bounded Uniform Convolution', boxpoints= 'all'))
fig.add_trace(go.Box(y=data[0], name= 'Hill Climbing'))
fig.add_trace(go.Box(y=data[1], name= 'Simulated Annealing'))
fig.add_trace(go.Box(y=data[2], name= 'Feature-Based Tabu Search'))

fig.show()