import plotly.graph_objects as go
import pandas as pd
import numpy as np
import json
from functools import partial

with open('../out/parameters.json') as json_file:
    data = json.load(json_file)


def plotQualities():
    z = np.array(data['qualities'])
    sh_0, sh_1 = z.shape
    x, y = np.linspace(0, 2, sh_0), np.linspace(0, 2, sh_1)
    print(z.shape)
    print(x)

    fig = go.Figure(data=[go.Surface(z=z, x=x, y=y)])

    fig.update_traces(contours_z=dict(show=True, usecolormap=True,
                                      highlightcolor="limegreen", project_z=True))
    fig.update_layout(title='', autosize=False,
                      width=1000, height=800,
                      scene=dict(
                          xaxis_title='P (x)',
                          yaxis_title='R (y)',
                          zaxis_title='Qualidade',
                          xaxis=dict(nticks=20),
                          yaxis=dict(nticks=20),
                      ),
                      margin=dict(l=65, r=50, b=65, t=90))

    fig.show()


# plot( partial(shifted_sphere_function, o=[0, 0], f_bias=-450), 10, 10 )
plotQualities()
