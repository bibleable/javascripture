/*global define, debug, module, test, ok*///define(['../api/search'], function (search) {
//	"use strict";
var search=javascripture.api.search,javascriptureTestHelper={referenceCount:function(e,t,n){equal(search.getReferences(e).length,t,n.replace(/EXPECTED/gi,t).replace(/TERM/gi,e.word).replace(/LANGUAGE/gi,e.language))}},parameters={language:"english",range:"verse"};module("search english");test("search",function(){ok(search,"the search object exists")});test("search for one term in a verse",function(){expect(1);var t=search.getReferences({language:"english",word:"void",range:"verse"});t.done(function(){start();equal(t.references.length,32,'there are 32 verses that contain "void" in Englush')});stop()});