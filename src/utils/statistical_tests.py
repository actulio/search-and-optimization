from scipy import stats
import scikit_posthocs as sp
import matplotlib.pyplot as plt


# data = [
#   [-449.08, -448.84, -448.93, -448.81, -448.61, -448.74, -448.85, -448.65, -448.92, -448.69],
#   [-448.32, -447.73, -447.36, -448.65, -448.15, -447.16, -448.42, -448.23, -448.45, -448.89],
#   [-448.32, -447.73, -447.36, -448.65, -448.15, -447.16, -448.42, -448.23, -448.45, -448.8]
# ]

data = [
  [743.46, 743.51, 2603.57, 639.54, 868.75, 727.73, 700.74, 608.72, 1313.97, 614.04],
  [3860.04, 8372.71, 859.85, 4729.75, 1151.68, 848.69, 752.76, 827.4, 9869.73, 696.36],
  [965.78, 6554.15, 914.4, 1304.8, 773.12, 1045.78, 880.27, 911.54, 9405.24, 866.11],
]

# Friedman de grupo
print(stats.friedmanchisquare(*data))

# Kruskal-Wallis de grupo
print(stats.kruskal(*data))

#Teste de Conover baseado em Kruskal-Wallis
pc = sp.posthoc_conover(data)

#Caso precise mudar os indices e colunas do DataFrame
pc.columns = ['HC', 'SA', 'TABU']
pc.index = ['HC', 'SA', 'TABU']

print(pc)

#Heatmap do Teste de Conover
cmap = ['1', '#fb6a4a',  '#08306b',  '#4292c6', '#c6dbef']
heatmap_args = {'cmap': cmap, 'linewidths': 0.25, 'linecolor': '0.5', 'clip_on': False, 'square': True, 'cbar_ax_bbox': [0.80, 0.35, 0.04, 0.3]}
sp.sign_plot(pc, **heatmap_args)
plt.show()

#Exportar Dataframe para Latex
print(pc.to_latex(decimal=",", float_format="%.2f"))