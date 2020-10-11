import plotly.express as px
import plotly.graph_objects as go
import json

with open('../out/out.json') as json_file:
  data = json.load(json_file)

# df = px.data.tips()
# fig = px.box(df, x="Quality", y="total_bill")
# fig.show()

fig = go.Figure()
fig.add_trace(go.Box(y=data['qualities'], name= 'Bounded Uniform Convolution', boxpoints= 'all'))
fig.add_trace(go.Box(y=data['qualities']))

fig.show()