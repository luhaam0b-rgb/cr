# Glossary

⁧مسرد المصطلحات: بطاقات صغيرة في شبكة، في كل بطاقة المصطلح العربي، فمقابله الأصلي، فتعريف من سطر أو سطرين. وفوقه حقل بحث.⁩

## ⁧البنية⁩

```html
<div class="gq stack-sm">
  <label class="small" for="gq">بحث في المسرد بالعربية أو الإنجليزية</label>
  <input id="gq" type="search" placeholder="مثال: retard أو مرحّل" autocomplete="off">
  <p class="count" id="gcount" aria-live="polite"></p>
</div>
<div class="sec ggroup">
  <header><h2>النظام والإشارات</h2></header>
  <div class="gl">
    <div class="term"><span class="a">جهاز بدء</span><span class="e" lang="en">Initiating device</span><span class="d">كاشف أو مفتاح أو جهاز يدوي يرسل إشارته إلى الوحدة.</span></div>
  </div>
</div>
```

## ⁧قواعد⁩

- ⁧ترجمة واحدة ثابتة لكل مصطلح في المرجع كله، والمسرد هو مرجعها.⁩
- ⁧المصطلحات مجموعة بحسب الموضوع ‎`.ggroup`‎، لا أبجديًا. المجموعة التي لا يبقى فيها مصطلح بعد البحث تختفي بعنوانها.⁩
- ⁧المقابل الأصلي ‎`.e`‎ بلون ‎`aurora`‎ ومعه ‎`lang`‎.⁩
- ⁧التعريف يقول ما الشيء وما يفعله، بلا إحالة إلى خارج المرجع.⁩
