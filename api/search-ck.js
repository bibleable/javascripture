jQuery.fn.slowEach=function(e,t,n){function i(){n.call(e[r],r,e[r])!==!1&&++r<e.length&&setTimeout(i,t)}if(!e.length)return;var r=0;i()};javascripture.api.search={language:{english:javascripture.data.english,greek:javascripture.data.greek,hebrew:javascripture.data.hebrew},books:{english:["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalm","Proverbs","Ecclesiastes","Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"],hebrew:["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalm","Proverbs","Ecclesiastes","Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"],greek:["Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"]},types:["word","lemma","morph"],results:{references:[],matches:{}},getReferences:function(e){var t=this;console.log(e);results=$.Deferred();results.references=[];this.lookForTerm(e,results);return results},doesDataMatchTerm:function(e,t,n,r){t=t.toLowerCase();n=n.toLowerCase();return t===n?!0:e!=="lemma"&&!r&&t.search(n)>-1?!0:!1},resetMatches:function(){this.results.matches={}},addReference:function(e,t,n,r){return r.references.push({book:e,chapter:t+1,verse:n+1})},lookForTerm:function(e,t){var n=this;"undefined"==typeof e.language&&(e.language=n.inferLanguage(e));var r=this.language[e.language];n.results.references=[];n.resetMatches();var i=this.books[e.language],s=0;for(var o in n.types){var u=n.types[o];termString=e[u];if(termString!==undefined&&termString!==""){var a=termString.split(" ");s+=a.length}}var f=1;$("#searchSpeed").length>0&&(f=$("#searchSpeed").val());jQuery.fn.slowEach(i,f,function(o,u){var a=r[u];$(document).trigger("loading","searching "+u);for(var f=0,l=a.length;f<l;f++){chapter=a[f];e.range==="chapter"&&e.clusivity==="exclusive"&&n.resetMatches();for(var c=0,h=chapter.length;c<h;c++){verse=chapter[c];e.range==="verse"&&e.clusivity==="exclusive"&&n.resetMatches();for(var p=0,d=verse.length;p<d;p++){var v=verse[p];e.range==="word"&&e.clusivity==="exclusive"&&n.resetMatches();var m,g;for(var y in n.types){var b=n.types[y];g=e[b];if(n.areTheTermStringAndWordObjectAreGoodToSearch(g,v,y)){var w=g.split(" ");for(var E=0,S=w.length;E<S;E++){var x=w[E];n.doesDataMatchTerm(b,v[y],x,e.strict)&&(e.clusivity==="exclusive"?n.results.matches[x]=!0:n.addReference(u,f,c,t))}}}if(e.clusivity==="exclusive"){m=0;$.each(n.results.matches,function(e,t){m++});if(m>0&&m>=s){console.log(m,s);n.addReference(u,f,c,t);n.resetMatches()}}}}}o===i.length-1&&t.resolve()})},standarizeWordEndings:function(e){return e.replace(/ם/gi,"מ")},getTranslations:function(e){},inferLanguage:function(e){var t="english";e.lemma.substr(0,1)==="H"&&(t="hebrew");e.lemma.substr(0,1)==="G"&&(t="greek");return t},areTheTermStringAndWordObjectAreGoodToSearch:function(e,t,n){return e!==undefined&&e!==""&&t!==undefined&&typeof t[n]!="undefined"}};