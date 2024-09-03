import pandas as pd

# قم بتحديد مسار ملف Excel
excel_file_path = '/mnt/data/your_excel_file.xlsx'  # استبدل 'your_excel_file.xlsx' باسم ملفك

# قم بقراءة ملف Excel
df = pd.read_excel("D:\شغل\شغل\زكاه مال\zakat\your_file.xlsx")

# تحويل البيانات إلى صيغة JSON
json_data = df.to_json(orient='records', force_ascii=False, indent=4)

# حفظ البيانات في ملف JSON
with open('data.json', 'w', encoding='utf-8') as json_file:
    json_file.write(json_data)

print("تم تحويل ملف Excel إلى JSON بنجاح!")
