import pandas as pd
from datetime import datetime
import webbrowser
import os

# تحميل البيانات من ملف Excel
df = pd.read_excel('zakat_data.xlsx')

# تصدير البيانات إلى ملف JSON
df.to_json('data.json', orient='records', force_ascii=False)

# إضافة سجل جديد
def add_new_record(name, amount):
    global df
    new_row = pd.DataFrame({'Name': [name], 'Amount': [amount], 'Date': [datetime.now().strftime('%Y-%m-%d')]})
    df = pd.concat([df, new_row], ignore_index=True)
    df.to_excel('zakat_data.xlsx', index=False)
    df.to_json('data.json', orient='records', force_ascii=False)  # تحديث ملف JSON

# مثال على استخدام الوظيفة
add_new_record('أحمد', 1000)

# فتح ملف HTML في المتصفح
html_file_path = os.path.abspath("index.html")
webbrowser.open(f"file://{html_file_path}")
