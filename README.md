# tessellations

Description on the way!


## Change log

2017-11-28 Bug fix:

&lt;use&gt; elements with (xlink:)hrefs provided by JS weren't appearing in the animation in Safari. This was because setAttribute('xlink:href', value) doesn't work for xlink:href, but has to be setAttributeNS('http://www.w3.org/1999/xlink', 'href', value) as noted in the first response at https://github.com/patrick-steele-idem/morphdom/issues/34. Updating the setAttribute wrapper function fixed this. Noting that in Safari web inspector, the elements in question now show with an href attribute rather than xlink:href, and I thought only xlink:href worked on Safari, but these are displaying fine now.


2017-11-28 Initial commit (after lots of unversioned work!)