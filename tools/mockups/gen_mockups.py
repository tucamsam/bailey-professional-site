"""Regenerates the fictional system mock-ups used in the course and design document.
Run: pip install playwright && playwright install chromium && python tools/mockups/gen_mockups.py
PNGs land in tools/mockups/out/. Convert to .webp for course/img (e.g. with Pillow).
All data here is fictional. Never replace these with real system screenshots."""
import sys, asyncio, os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'out'); os.makedirs(OUT,exist_ok=True)
from playwright.async_api import async_playwright
CSS="""body{margin:0;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#222;background:#fff}
.wrap{padding:14px 18px}
h1{font-size:20px;color:#1f3b73;margin:0 0 4px}
.sub{color:#777;font-size:11px;margin-bottom:12px}
.f{display:grid;grid-template-columns:150px 1fr;row-gap:6px;align-items:center}
.f label{text-align:right;font-weight:600;padding-right:8px}
.in{border:1px solid #999;padding:2px 6px;width:220px;background:#fff}
.sel{border:1px solid #999;padding:2px 6px;width:150px;display:inline-block}
.sec{background:#e8eef7;color:#1f3b73;font-weight:600;padding:4px 8px;margin:10px 0 6px}
.btn{display:inline-block;border:1px solid #888;background:#eee;padding:3px 12px;margin:8px 0 0 150px}
table{border-collapse:collapse;width:100%;margin-top:10px;font-size:12px}
th{background:#1f3b73;color:#fff;padding:4px 6px;text-align:left}
td{padding:3px 6px;border-bottom:1px solid #e3e3e3}
tr:nth-child(even) td{background:#f4f6f9}
a{color:#1f5fbf;text-decoration:underline}
.hl{outline:3px solid #d0021b;outline-offset:-2px}
.xl th{background:#f3f3f3;color:#000;border:1px solid #ccc;font-weight:600}
.xl td{border:1px solid #ddd;background:#fff!important}
.xl .col{background:#e9e9e9!important;color:#555;text-align:center;font-weight:400}
.tag{text-align:right;padding:0 18px 6px;font-size:10px;color:#999}
"""
def page(body): return f"<html><head><style>{CSS}</style></head><body><div class=wrap>{body}</div><div class=tag>Illustrative mock-up · fictional data</div></body></html>"
def cm_form(text,year,filters=True,hl=None):
    s=f"""<h1>Course Manager</h1><div class=sub>Course Catalog System</div>
<div class=f><label>Search Text:</label><div class=in>{text}</div>
<label>Curriculum:</label><div><span class=sel>-- Any --</span></div>
<label>Subject Area:</label><div><span class=sel>-- Any --</span></div>
<label>School Year:</label><div><span class=sel>{year}</span></div>
<label>Include Linked Courses?</label><div>&#9745; <i>Include courses created as linked copies</i></div>
<label>Managed At:</label><div><span class=sel style="width:220px">Organization Root</span></div></div>"""
    if filters:
        s+=f"""<div class=sec>&#9662; Additional Search Filters</div>
<div class=f><label>Available At:</label><div {'class=hl' if hl=='avail' else ''}>&#9675; Any location &nbsp; &#9673; Specific location(s): <span class=sel>Virtual School 07</span> &#9745; Sub-locations?</div>
<label>Status:</label><div><span class=sel>-- Any --</span></div>
<label>Course Placement:</label><div>&#9673; Both &nbsp; &#9675; Allows &nbsp; &#9675; Does not allow</div></div>"""
    else: s+="<div class=sec>&#9656; Additional Search Filters</div>"
    return s+"<div class=btn>Search</div>"
def cm_table(rows,hlcol=None,hlrows=()):
    t="<table><tr><th>ID</th><th>Name</th><th>Base Course ID</th><th>Management Description</th></tr>"
    for i,(cid,name,base,desc) in enumerate(rows):
        c='class=hl' if (hlcol and i in hlrows) else ''
        t+=f"<tr><td>{cid}</td><td><a>{name}</a></td><td {c}>{'<a>'+base+'</a>' if base else ''}</td><td>{desc}</td></tr>"
    return t+"</table>"
math=[("345","Connected Math 6 A","789","Physical, Standard C, Non-Standard M"),("456","Connected Math 6 B","901","Physical, Standard C, Non-Standard M"),
("789","Essential Math 6 A","","Physical, Standard C, Standard M"),("901","Essential Math 6 B","","Physical, Standard C, Standard M"),
("432","Math 6 A","","Physical, Standard C, Standard M"),("678","Math 6 B","","Physical, Standard C, Standard M")]
ag=[("149715","23/24 Honors American Government B","","Standard C, Standard M, National"),("149725","23/24 Honors American Government B","149715","Standard C, Standard M, School 03"),
("149726","23/24 Honors American Government B","149715","Standard C, Standard M, School 05"),("140627","23/24 American Government","","Standard C, Standard M, National")]
ag+= [(str(149549+i),"23/24 American Government","140627",f"Standard C, Standard M, School {i+1:02d}") for i in range(8)]
ag+=[("141123","23/24 American Government (AR)","","Standard C, Standard M, National, AR"),("140998","23/24 American Government (NV)","","Standard C, Standard M, NV"),
("140995","23/24 American Government (CA)","","Standard C, Standard M, Multiple"),("140507","23/24 American Government (FL)","","Standard C, Standard M, National"),("148953","23/24 American Government (FL)","140507","Standard C, Standard M, Coastal")]
def cmr_form(hl=None):
    yrs=''.join(f"<span style='display:inline-block;width:92px'>{'&#9745;' if y=='2023-2024' else '&#9744;'} {y}</span>" for y in ['2023-2024','2022-2023','2021-2022','2020-2021','2019-2020','2018-2019','2017-2018','2016-2017'])
    return f"""<h1>Course Metadata Report</h1><div class=sub><a>View recent reports</a></div>
<div class=f><label>School Year(s):</label><div style="border:1px solid #6a6;padding:4px;width:380px">{yrs}</div>
<label>Output Type:</label><div>&#9673; Generate report in Excel<br>&#9675; Generate report inline (includes rich-text content)</div>
<label>Managed At:</label><div><span class=sel style="width:220px">Organization Root</span></div>
<label>Available At:</label><div><span {'class=hl' if hl=='any' else ''}>&#9673; Any location</span><br>&#9675; Specific location(s) <span class=sel>Select…</span> &#9744; Sub-locations?</div>
<label>Show cost detail:</label><div>&#9744; Show cost detail in the generated report</div></div>
<div class='btn {'hl' if hl=='gen' else ''}'>Generate Report</div>"""
def xl(rows):
    t="<table class=xl><tr><th class=col></th><th class=col>A</th><th class=col>B</th><th class=col>C</th><th class=col>D</th><th class=col>E</th></tr><tr><th class=col>1</th><th>Course ID</th><th>Name</th><th>Display Name</th><th>Base Course ID</th><th>Management Description</th></tr>"
    for i,r in enumerate(rows): t+=f"<tr><td class=col>{i+2}</td>"+''.join(f"<td>{x}</td>" for x in r)+"</tr>"
    return t+"</table>"
tx=[("583","22/23 P: Texas State History 7 A","Texas State History 7 A","","Standard C, Standard M, TX"),("587","22/23 P: Texas State History 7 A","Texas State History 7 A","583","Standard C, Standard M, School 11"),
("584","22/23 P: Texas State History 7 B","Texas State History 7 B","","Standard C, Standard M, TX"),("586","22/23 P: Texas State History 7 B","Texas State History 7 B","584","Standard C, Standard M, School 11"),
("765","Alabama State History 4","Alabama State History 4","","Standard C, Standard M, AL"),("905","Alabama State History 4","Alabama State History 4","765","Standard C, Standard M, School 02"),
("894","Arizona State History 3","Arizona State History","","Standard C, Standard M, AZ")]
geo=[("149445","Geography and Society","Geography and Society","126201","Standard C, Non-Standard M, National"),("141140","23/24 Geography and Society (UT)","Geography and Society","","Standard C, Standard M, National, UT"),
("140244","23/24 Geography and Society (TX)","Geography and Society","","Standard C, Standard M, National, TX"),("141132","23/24 Geography and Society (MN)","Geography and Society","","Standard C, Standard M, National"),
("149146","23/24 Geography and Society (MN)","Geography and Society","141132","Standard C, Standard M, School 09"),("140923","23/24 Geography and Society (AR)","Geography and Society","","Standard C, Standard M, National, AR"),
("149418","23/24 Geography and Society","Geography and Society","","Standard C, Standard M, National")]
geo+=[(str(149419+i),"23/24 Geography and Society","Geography and Society","149418",f"Standard C, Standard M, School {i+1:02d}") for i in range(9)]
reports="<h1>Reports</h1>"+''.join(f"<div class=sec>{h}</div>"+''.join(f"<div style='margin:3px 10px'><a>{n}</a> – <span style='color:#555'>{d}</span></div>" for n,d in items) for h,items in [
("Courses and Sections",[("Course Metadata Report","All courses for a selected curriculum"),("Course Metadata Report (Beta)","All courses with filters by school year and location"),("Course Selection Report","Course selection sheet by school and year"),("Courses of Study Report","Students and their primary grading period")]),
("Assessment",[("Assessment Analysis Report","Assessment metrics and item statistics"),("Assessment Response Export","All responses to a set of assessments")]),
("Other",[("Location Data Report","Address and contact info for locations"),("Media Items Report","Report for media items")])])
SHOTS={
 "cm_math6_full":(page(cm_form("Math 6","2022-2023")+cm_table(math)),660),
 "cm_math6_base":(page(cm_form("Math 6","2022-2023",False)+cm_table(math,True,(2,3,4,5))),460),
 "cm_math6_linked":(page(cm_form("Math 6","2022-2023",False)+cm_table(math,True,(0,1))),460),
 "cm_form":(page(cm_form("Math 6","2022-2023")),640),
 "cm_amgov":(page(cm_form("American Government","2023-2024",False)+cm_table(ag)),620),
 "cmr_form_any":(page(cmr_form('any')),640),
 "cmr_form_gen":(page(cmr_form('gen')),640),
 "cmr_tx":(page(xl(tx)),900),
 "cmr_geo":(page(xl(geo)),1000),
 "reports":(page(reports),620),
}
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for k,(html,w) in SHOTS.items():
            pg=await b.new_page(viewport={'width':w,'height':200},device_scale_factor=2)
            await pg.set_content(html); await pg.screenshot(path=os.path.join(OUT,f'{k}.png'),full_page=True); await pg.close()
        await b.close()
asyncio.run(main())
