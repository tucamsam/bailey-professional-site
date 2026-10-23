# Survey charts for the design document (needs matplotlib). Output: tools/design-doc/out/
import os, matplotlib; matplotlib.use('Agg')
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out'); os.makedirs(OUT,exist_ok=True)
import matplotlib.pyplot as plt
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'axes.spines.top':False,'axes.spines.right':False})
C='#5B4A8B'; G='#C9C3DB'
def likert(ax,counts,title,lo,hi):
    x=range(6); bars=ax.bar(x,counts,color=[C if c==max(counts) else '#8F80B8' for c in counts],width=0.65)
    for b,c in zip(bars,counts): ax.text(b.get_x()+b.get_width()/2,c+0.05,str(c),ha='center',va='bottom',fontsize=9)
    ax.set_xticks(list(x)); ax.set_xticklabels(['0','1','2','3','4','5']); ax.set_ylim(0,3.6); ax.set_yticks([0,1,2,3])
    ax.set_title(title,fontsize=10,loc='left',fontweight='bold'); ax.set_xlabel(f'0 = {lo}   ·   5 = {hi}',fontsize=8,color='#555')
fig,axs=plt.subplots(1,3,figsize=(9.5,2.9))
likert(axs[0],[0,1,1,2,1,1],'Q3  Confidence locating CIDs','Not confident','Very confident')
likert(axs[1],[0,0,1,1,2,2],'Q4  Training would help','Do not agree','Strongly agree')
likert(axs[2],[0,0,0,1,2,3],'Q5  Willing to take 15-min training','Not willing','Extremely willing')
axs[0].set_ylabel('Respondents (n = 6)')
fig.tight_layout(); fig.savefig(os.path.join(OUT,'fig_likert.png'),dpi=200)
fig,axs=plt.subplots(1,2,figsize=(9.5,2.4))
def hb(ax,labels,vals,title):
    y=range(len(labels))[::-1]; ax.barh(list(y),vals,color=[C if v==max(vals) else '#8F80B8' for v in vals],height=0.6)
    for yy,v in zip(y,vals): ax.text(v+0.08,yy,str(v),va='center',fontsize=9)
    ax.set_yticks(list(y)); ax.set_yticklabels(labels,fontsize=8.5); ax.set_xlim(0,6); ax.set_xticks([0,2,4,6]); ax.set_title(title,fontsize=10,loc='left',fontweight='bold')
hb(axs[0],['Course Manager tool','Metadata reports','Both'],[1,0,5],'Q6  Process to learn more about')
hb(axs[1],['More documentation','More targeted training','Training + documentation'],[1,0,5],'Q7  What would help most')
fig.tight_layout(); fig.savefig(os.path.join(OUT,'fig_choice.png'),dpi=200)
