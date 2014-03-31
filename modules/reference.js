/*globals javascripture*/
javascripture.modules.reference = {
	load: function( reference ) {
		var self = this,
		    book = reference.book,
		    chapter = reference.chapter,
		    verse = reference.verse;

		if ( 'undefined' == typeof verse ) {
			reference.verse = 1;
		}

//		$('#verse').html( $threeChapters );
		worker.addEventListener('message', function(e) {
			if( e.data.task === 'reference' ) {
				var chapterText = '<div class="three-references"';

				if ( e.data.result.prev.book ) {
					chapterText += ' data-prev=\'' + JSON.stringify( e.data.result.prev ) + '\'';
				}
				if ( e.data.result.next.book ) {
					chapterText += ' data-next=\'' + JSON.stringify( e.data.result.next ) + '\'';
				}
				chapterText += '>';

				e.data.result.chapters.forEach( function( chapterData ) {
					chapterText += self.getChapterText( reference, chapterData, e.data.result.testament );
				} );

				chapterText += '</div>';

				$('#verse').html( chapterText );

				var title = book;
				if ( typeof chapter !== 'undefined' )
					title += ' ' + chapter;

				if ( typeof verse !== 'undefined' )
					title += ':' + verse;

				$( 'head title' ).text( title );

				if ( $.fn.waypoint ) {
					$('.reference').waypoint('destroy');
				}
				self.scrollToVerse( $( '#current' ) );
			}
		} );

		reference.version = $('#versionSelector').val();

		worker.postMessage( {
			task: 'reference',
			parameters: reference
		} ); // Send data to our worker.

		return this; //makes it chainable

	},
	scrollToVerse: function ( verse, offset ) {
		if ( undefined === offset ) {
			offset = 0;
		}
		$( document ).scrollTop( 0 );
		offset = offset - $('.dock').height();

		//there must be a better way to do this, but the problem is that the top animation hasn't happened by this point
		if ( $( 'html' ).hasClass( 'reading-mode' ) ) {
			offset = offset - 50;
		}

		if(verse.length > 0) {
//				$('#verse').closest('.panel').scrollTop(verse.offset().top - $('.dock').height() - $('h1').height() );
			$( document ).scrollTo( verse, { offset: offset } );
		}

		$( document ).trigger( 'createWayPoint' );
	},
	getAnchoringData: function ( direction ) {
		//anchor to current verse
		var anchorPointSelector = '#current',
			offset = 0,
			$bodyOffset = $( document ).scrollTop(),
			$anchorVerse;

		//anchor to scrollstop point
		if ( direction ) {
			if ( direction === 'prev' ) {
				$anchorVerse = $('.reference:first-child ol.wrapper li:first-child');
			}

			if ( direction === 'next' ) {
				$anchorVerse = $('.reference:last-child ol.wrapper li:last-child');
			}
			anchorPointSelector = '#' + $anchorVerse.attr('id');
			offset = $bodyOffset - $anchorVerse.offset().top + $('.dock').height();
		}

		return [offset, anchorPointSelector];
	},
	anchorReference: function ( anchoringData ) {

		var anchorPointSelector = anchoringData[1],
		    offset = anchoringData[0],
		    $anchorPoint = $( anchorPointSelector );

		if ( anchorPointSelector === '.current-verse' ) {
			verseHeight = $anchorPoint.height(),
			offset = -$(window).height() / 2 + verseHeight;
		}

		//anchor to a chapter
		if ( $anchorPoint.length === 0 ) {
			$anchorPoint = $( '#' + jsonCollection.currentId );
			offset = - $('[data-role=header]').height();// - 10;
		}

		this.scrollToVerse( $anchorPoint, offset );
	},
	getReferenceFromUrl: function () {
		var hashArray = window.location.hash.split('&'),
			reference = {};

		if ( hashArray.length > 1 ) {
			reference.book = hashArray[0].split('=')[1],
			reference.chapter = parseInt(hashArray[1].split('=')[1], 10),
			reference.verse = 1;
	        if ( hashArray[2] )
	            reference.verse = parseInt(hashArray[2].split('=')[1], 10);
		}
		return reference;
	},
	loadReferenceFromHash: function () {
	    var hash = window.location.hash;
	    if(hash.indexOf('search') > -1){
	        var word = hash.split('=')[1];
	        setTimeout(function(){
		        createSearchReferencesPanel({lemma:word});
		    } );
	    } else {
	        var parameterPairArray = hash.split('&');
	        //this is bad
	        if ( parameterPairArray.length > 1 ) {
				var book = parameterPairArray[0].split('=')[1];
		        var chapter = parseInt(parameterPairArray[1].split('=')[1], 10);
		        var verse = 1;
		        if ( parameterPairArray[2] ) {
		            verse = parseInt(parameterPairArray[2].split('=')[1], 10);
		        }
			    if ( localStorage ) {
				    localStorage.reference = [ book, chapter, verse];
			    }
				javascripture.modules.reference.load( {
			        book: book,
			        chapter: chapter,
			        verse: verse
		        } );
	        }

	    }
	},
	getChapterText: function ( reference, chapterData, testament ) {
		var self = this,
		    book = reference.book,
		    chapter = reference.chapter,
		    verse = reference.verse,
			chapterInArray = chapter - 1,
			verseInArray = verse - 1,
			context = false;

		var chapterText = '<div class="reference frequencyAnalysis" data-book="' + book + '" data-chapter="' + chapter + '"><h1>' + book + ' ' + chapter + '</h1>';
		chapterText += '<ol class="wrapper">';

		if ( chapterData.translation ) {
			chapterData.translation.forEach( function( verseText, verseNumber ) {
				chapterText += '<li id="' + book.replace( / /gi, '_' ) + '_' + chapter + '_' + ( verseNumber + 1 ) + '"';
				if(verseNumber === verseInArray) {
					chapterText += ' class="current"';
				}
				chapterText += 'data-verse="' + ( verseNumber + 1 ) + '">';
				chapterText += '<div class="wrapper"';
				if(verseNumber === verseInArray) {
					chapterText += ' id="current"';
				}
				if(verseNumber === verseInArray-5) {
					chapterText += ' id="context"';
					context = true;
				}
				chapterText += '>';
				chapterText += '<div class="english">';
					if ( reference.version === 'lc' ) {
						//same as below
						chapterData.original[verseNumber].forEach( function( wordObject, wordNumber ) {
							if ( wordObject ) {
								chapterText += self.createWordString( wordObject, 'english', testament, reference.version );
							}
						});
					} else {
						chapterData.translation[verseNumber].forEach( function( wordObject, wordNumber ) {
							if ( wordObject ) {
								chapterText += self.createWordString( wordObject, 'english', testament, reference.version );
							}
						});
					}
				chapterText += "</div>";

				//Load hebrew
				if(	chapterData.original[verseNumber] ) {
					chapterText += "<div class='original " + testament + "'>";
					chapterData.original[verseNumber].forEach( function( wordObject, wordNumber ) {
						if ( wordObject ) {
							chapterText += self.createWordString( wordObject, testament, testament );
						}
					});
					chapterText += "</div>";
				}
				chapterText += '</div>';
				chapterText += '</li>';
			});
		}

		chapterText += '</ol>';
		chapterText += '</div>';
		return chapterText;
	},
	createWordString: function ( wordArray, language, testament, version ) {
		var self = this,
		    wordString = '',
		    families = [];
		if ( typeof wordArray[ 1 ] === 'undefined' )
			return '<span>' + wordArray[0] + '</span> ';

		lemma = wordArray[ 1 ];
		if ( lemma ) {
			lemmaArray = lemma.split( ' ' );
			lemmaArray.forEach( function( lemmaValue, key ) {
				families.push( javascripture.api.word.getFamily( lemmaValue ) );
			} );
		}
		wordString += '<span';
		wordString += ' class="' + families.join( ' ' ) + '"';
		wordString += ' title="' + lemma;
		if ( wordArray[2] ) {
			wordString += ' ' + wordArray[2];
		}
		wordString += '"';
		wordString += ' data-word="' + wordArray[0] + '"';
		wordString += ' data-lemma="' + wordArray[1] + '"';
		wordString += ' data-language="' + testament + '"';
		wordString += ' data-range="verse"';
		wordString += ' data-family="' + families.join( ' ' ) + '"';
		if ( wordArray[2] ) {
			wordString += ' data-morph="' + wordArray[2] + '"';
		}
		wordString += '>';
		if ( version === 'lc' && language === 'english' ) {
			 wordString += javascripture.modules.translateLiterally.getWord( wordArray );
		} else {
			wordString += wordArray[0];
		}
		wordString += '</span> ';
		return wordString;
	}
};



/*globals javascripture*/
;( function ( $ ) {
	var english = javascripture.data.english;
	$.fn.scrollStopped = function(callback) {
	    $(this).scroll( function () {
	        var self = this, $this = $(self);
	        if ($this.data('scrollTimeout')) {
	          clearTimeout($this.data('scrollTimeout'));
	        }
	        $this.data('scrollTimeout', setTimeout(callback,250,self));
	    });
	};

	javascripture.modules.reference.loadReferenceFromHash();

	$(window).bind( 'hashchange', function(e) {
	    var startDate = new Date();
	    javascripture.modules.reference.loadReferenceFromHash();
	    var endDate = new Date();
		timer(startDate, endDate);
	});

	$( window ).scrollStopped( function() {
		var scrollTop = $( document ).scrollTop(),
			verseHeight = $( '.referencePanel' ).height() - $( window ).height(),// + $( '.dock' ).height(),
			anchoringData;
		if ( scrollTop <= 0 ) {
			console.log('prev');
			var prev = $( '.three-references' ).data( 'prev' );
			anchoringData = javascripture.modules.reference.getAnchoringData( 'prev' );
			javascripture.modules.reference.load( prev ).anchorReference( anchoringData );
		}
		if ( scrollTop >= verseHeight ) {
			console.log('next');
			var next = $( '.three-references' ).data( 'next' );
			anchoringData = javascripture.modules.reference.getAnchoringData( 'next' );
			javascripture.modules.reference.load( next ).anchorReference( anchoringData );
		}
	});

	$('.goToReference').submit(function (event) {
		event.preventDefault();
		var reference = bible.parseReference( $('#goToReference').val() );

		var hash = 'book=' + bible.Data.books[reference.bookID - 1][0] + '&chapter=' + reference.chapter + '&verse=' + reference.verse;
		window.location.hash = hash;
		$( this ).closest( '.popup' ).popup( 'close' );
		$('#goToReference').blur();
		if ( $( 'html' ).hasClass( 'reading-mode' ) ) {
			hideDock();
		}
		return false;
	});

} )( jQuery );