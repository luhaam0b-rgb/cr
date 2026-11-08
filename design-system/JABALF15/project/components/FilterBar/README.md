# FilterBar

⁧حقل بحث وقوائم منسدلة وخانة اختيار فوق قائمة طويلة، وتحتها عدّاد النتائج.⁩

## ⁧البنية⁩

```html
<div class="ctl">
  <label class="f-q" for="q">بحث بالرمز أو العنوان العربي أو الأصلي
    <input id="q" type="search" placeholder="مثال: 72 أو رشاشات أو sprinkler" autocomplete="off"></label>
  <label for="fcat">المجال <select id="fcat">…</select></label>
  <label for="ftype">النوع <select id="ftype">…</select></label>
  <label for="fkind">النسخة <select id="fkind">…</select></label>
</div>
<label class="chk" for="fmemo"><input type="checkbox" id="fmemo"> الوثائق ذات الملاحظات فقط</label>
<p class="count" id="count" aria-live="polite"></p>
```

⁧المعرّفات ‎`q`‎ و‎`fcat`‎ و‎`ftype`‎ و‎`fkind`‎ و‎`fmemo`‎ و‎`count`‎ هي ما يقرؤه السكربت. بحث المسرد حقل واحد بالمعرّف ‎`gq`‎ وعدّاده ‎`gcount`‎.⁩

## ⁧السلوك⁩

- ⁧البحث يطابق كل كلمة في أي موضع من نص البند، ويتجاهل التشكيل والتطويل وفروق الهمزة والتاء المربوطة والألف المقصورة.⁩
- ⁧رقم وحده، مثل «72»، يعرض كل ما يحمل هذا الرقم.⁩
- ⁧العدّاد ‎`aria-live="polite"`‎ فيُعلن التغيير لقارئ الشاشة.⁩

## ⁧قواعد⁩

- ⁧لكل حقل ‎`label`‎ ظاهر فوقه. النص الإرشادي داخل الحقل مثال، وليس بديلًا عن التسمية.⁩
- ⁧حدّ الحقل بلون ‎`edge-ctl`‎، والنص الإرشادي بلون ‎`muted`‎.⁩
- ⁧عند التركيز تظهر الحلقة الذهبية ويتحول الحدّ إلى ‎`gold`‎. لا يُلغى ‎`outline`‎.⁩
