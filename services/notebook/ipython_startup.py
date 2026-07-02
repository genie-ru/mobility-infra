# 全カーネル起動時に matplotlib の日本語フォントを設定（グラフの文字化け防止）。
import matplotlib

matplotlib.rcParams["font.family"] = "IPAexGothic"
matplotlib.rcParams["axes.unicode_minus"] = False
