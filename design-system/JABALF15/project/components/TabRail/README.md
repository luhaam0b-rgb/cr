# TabRail

⁧شريط تبويبات لاصق أعلى الصفحة يقسم المرجع إلى أبواب، ويُعرض باب واحد في كل مرة. هو التنقل الرئيس الوحيد.⁩

## ⁧البنية⁩

```html
<nav class="rail" aria-label="أقسام المرجع"><div class="wrap" role="tablist">
  <button class="tab" role="tab" id="t-map" data-tab="map" aria-selected="true" aria-controls="p-map">الخريطة</button>
  <button class="tab" role="tab" id="t-alarm" data-tab="alarm" aria-selected="false" aria-controls="p-alarm" tabindex="-1">نظام الإنذار</button>
</div></nav>
<main>
  <section class="panel" id="p-map" role="tabpanel" aria-labelledby="t-map"><div class="wrap"> … </div></section>
  <section class="panel" id="p-alarm" role="tabpanel" aria-labelledby="t-alarm" hidden><div class="wrap"> … </div></section>
</main>
```

⁧لكل تبويب معرّف ‎`t-<اسم>`‎ وخاصية ‎`data-tab="<اسم>"`‎، وللوحته المعرّف ‎`p-<اسم>`‎. السكربت يربط بينهما بهذا الاسم.⁩

## ⁧السلوك⁩

- ⁧محطة Tab واحدة للشريط كله، والتنقل بين التبويبات بالأسهم. في الاتجاه العربي السهم الأيسر هو التالي، و Home و End لأول تبويب وآخره.⁩
- ⁧التبويب المحدد يُعبَّأ بلون ‎`gold`‎ ونصه ‎`bg`‎.⁩
- ⁧عند التبديل يُمرَّر الشريط نفسه ليتوسّط التبويب المحدد؛ الصفحة لا تتحرك أفقيًا.⁩
- ⁧رابط داخلي إلى عنصر في لوحة مخفية يفتح لوحته أولًا، ثم ينتقل العرض والتركيز معًا إلى الهدف.⁩
- ⁧عنوان الصفحة يحمل اسم التبويب بعد ‎`#`‎، فيُفتح الرابط المنسوخ على الباب نفسه.⁩

## ⁧قواعد⁩

- ⁧من خمسة إلى سبعة تبويبات، كل اسم كلمة أو كلمتان. ما زاد يمرَّر أفقيًا داخل الشريط.⁩
- ⁧‎`html { scroll-padding-top: 4.5rem }`‎ حتى لا يغطي الشريط عنصرًا مركَّزًا.⁩
- ⁧في وضع الألوان المفروضة يأخذ التبويب المحدد ‎`Highlight`‎ و‎`HighlightText`‎.⁩
- ⁧على شاشات اللمس ارتفاع التبويب 44px على الأقل.⁩
