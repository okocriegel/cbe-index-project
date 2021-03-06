//******************************************************************************
//
// 2020 text normalisation JavaScript Lib, 
// Prof. Charlotte Schubert Alte Geschichte, Leipzig
//
//******************************************************************************

/*
DEF: A text normalization is everything done to equalize encoding, appearance 
and composition of a sequence of signs called a text. There are two goals of 
normalization. The first is a common ground of signs  and the second is a 
reduction of differences between two sequences of signs.  Not every 
normalization step is useful for every comparison task! Remember: 
Sometimes it is important to not equalize word forms and 
sometimes it is important. 
*/


/*
GPLv3 copyrigth

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

//
"use strict"; 

//GLOBALS
let doUVlatin = false; 
const analysisNormalform = "NFKD";
const dispnormalform = "NFC";

let buchstGRI = {"Α":"A", "α":"a", "Β":"B", "β":"b", "Γ":"G", "γ":"g", "Δ":"D", "δ":"d", "Ε":"E", "ε":"e", "Ζ":"Z", "ζ":"z", "Η":"H", "η":"h", "Θ":"Th", "θ":"th", "Ι":"I", "ι":"i", "Κ": "K", "κ":"k", "Λ":"L", "λ":"l", "Μ":"M", "μ":"m", "Ν":"N", "ν":"n", "Ξ":"Xi", "ξ":"xi", "Ο":"O", "ο":"o", "Π":"P", "π":"p", "Ρ":"R", "ρ":"r", "Σ":"S", "σ":"s", "ς":"s", "Τ":"T", "τ":"t", "Υ":"U", "υ":"u", "Φ":"Ph", "φ":"ph", "Χ":"X", "χ":"x", "Ψ":"Ps", "ψ":"ps", "Ω":"O", "ω":"o"}
const groups = {"γγ":["n", "g"], "γκ":["n", "c"], "γξ":["n","x"], "γχ":["n", "ch"], "ηυ":["ē", "u"]}; //only great letters??????? what is with that?
const behauchung = { "῾":"h" }; //missing other Hauch???
const buchsCoptic = {"ϐ": "B", "ϑ":"Th", "ϱ":"r", "ϰ":"k", "ϒ":"y", "ϕ":"ph", "ϖ":"p", "Ϝ":"W", "ϝ":"w", "Ϙ":"Q","ϙ":"q", "Ϟ":"ḳ", "ϟ":"ḳ", "Ϲ":"S", "Ⲥ":"S", "ⲥ":"s", "ϲ":"s", "Ͻ":"S", "ͻ":"s","Ϳ ":"j","ϳ":"j","Ͱ":"h","ͱ":"h","Ⲁ":"A","ⲁ":"a", 
"ϴ":"t","Ⲑ":"t","ⲑ":"t","ϵ":"e","϶":"e","Ϸ":"Sh","ϸ":"sh", "ϼ":"P","Ϡ":"S","ϡ":"S","Ⳁ":"S","ⳁ":"s",
"Ͳ":"Ss", "ͳ":"ss", "Ϻ":"S","ϻ":"s", "Ϣ":"š","ϣ":"š", "Ϥ":"F","ϥ":"f", "Ϧ":"X", "Ⳉ":"X",
"ϧ":"x","ⳉ":"x", "Ϩ":"H", "ϩ":"h", "Ϫ":"J", "ϫ":"j", "Ϭ":"C","ϭ":"c","Ϯ":"Di","ϯ":"di", 
"Ͼ":"S", "Ͽ":"S", "ͼ":"s", "ͽ":"s", "Ⲃ":"B","ⲃ":"b","Ⲅ":"G","ⲅ":"g", "Ⲇ":"D", "ⲇ":"d", "Ⲉ":"E", "ⲉ":"e", 
"Ⲋ":"St", "ⲋ":"st", "Ⲍ":"Z", "ⲍ":"z", "Ⲏ":"ê", "ⲏ":"ê", "Ⲓ":"I", "ⲓ":"i", "Ⲕ":"K", "ⲕ":"k", 
"Ⲗ":"L", "ⲗ":"l", "Ⲙ":"M", "ⲙ":"m", "Ⲛ":"N","ⲛ":"n", "Ⲝ":"ks", "ⲝ":"ks", "Ⲟ	":"O", "ⲟ":"o", 
"Ⲡ":"B", "ⲡ":"b", "Ⲣ":"R","ⲣ":"r", "Ⲧ":"T", "ⲧ":"t", "Ⲩ":"U", "ⲩ":"u", "Ⲫ":"F","ⲫ":"f","Ⲭ":"Kh", "ⲭ":"kh",
"Ⲯ":"Ps", "ⲯ":"ps", "Ⲱ":"ô", "ⲱ":"ô", "Ͷ":"W", "ͷ":"w"}; // 

//"de" Akzente richtig, oder falsch????
let listofelusion = { "δ᾽":"δὲ","δ'":"δὲ", "ἀλλ’": "ἀλλά", "ἀνθ’": "ἀντί", "ἀπ’": "ἀπό", "ἀφ’": "ἀπό","γ’": "γε","γένοιτ’": "γένοιτο","δ’": "δέ","δι’": "διά","δύναιτ’": "δύναιτο","εἶτ’": "εἶτα","ἐπ’": "ἐπί","ἔτ’": "ἔτι","ἐφ’": "ἐπί","ἡγοῖντ’": "ἡγοῖντο","ἵν’": "ἵνα","καθ’": "κατά","κατ’": "κατά","μ’": "με","μεθ’": "μετά","μετ’": "μετά","μηδ’": "μηδέ","μήδ’": "μηδέ","ὅτ’": "ὅτε","οὐδ’": "οὐδέ","πάνθ’": "πάντα","πάντ’": "πάντα","παρ’": "παρά","ποτ’": "ποτε","σ’": "σε","ταῦθ’": "ταῦτα","ταῦτ’": "ταῦτα","τοῦτ’": "τοῦτο","ὑπ’": "ὑπό","ὑφ’": "ὑπό"};
const cleanhtmltags = new RegExp( /<[a-zA-Z\/]+>/, 'g' ); //hm not good
const cleanhtmlformat1 = new RegExp( '&nbsp;', 'g' );
const regEbr1 = new RegExp( '<br/>', 'g' ); 
const regEbr2 = new RegExp( '<br>', 'g' );
const cleanNEWL = new RegExp( '\n', 'g' );
const cleanRETL = new RegExp( '\r', 'g' );
const cleanstrangehochpunkt = new RegExp( '‧', 'g' );
const cleanthisbinde = new RegExp( '—', 'g' );
const cleanthisleer = new RegExp( '\xa0', 'g' );
const cleanleerpunkt = new RegExp( ' \\.', 'g' );
const cleanleerdoppelpunkt = new RegExp( ' :', 'g' );
const cleanleerkoma = new RegExp( ' ,', 'g' );
const cleanleersemik = new RegExp( ' ;', 'g' );
const cleanleerausrufe = new RegExp( ' !', 'g' );
const cleanleerfrege = new RegExp( ' \\?', 'g' );

//breakdown typographic letiances "Bindestriche und Geviertstriche"
const cleanklbindstrichvollbreit = new RegExp( '－', 'g' );
const cleanklbindstrichkurz = new RegExp( '﹣', 'g' );
const cleanklgeviert = new RegExp( '﹘', 'g' );
const cleanviertelgeviert = new RegExp( '‐', 'g' );
const cleanziffbreitergeviert = new RegExp( '‒', 'g' );
const cleanhalbgeviert = new RegExp( '–', 'g' );
const cleangeviert = new RegExp( '—', 'g' );

const escspitzeL = new RegExp( '<', 'g' );
const escspitzeR = new RegExp( '>', 'g' );

let notprivalpha = [];//["ἀΐω"];

// array of unicode diacritics (relevant for polytonic greek)
const diacriticsunicodeRegExp = new Array( 
	new RegExp( '\u{0313}', 'g' ), 
	new RegExp( "\u{0314}", 'g' ), 
	new RegExp( "\u{0300}", 'g' ), 
	new RegExp( "\u{0301}", 'g' ), 
	new RegExp( "\u{00B4}", 'g' ), 
	new RegExp( "\u{02CA}", 'g' ), 
	new RegExp( "\u{02B9}", 'g' ), 
	new RegExp( "\u{0342}", 'g' ), 
	new RegExp( "\u{0308}", 'g' ), 
	new RegExp( "\u{0304}", 'g' ), 
	new RegExp( "\u{0306}", 'g' ),
    new RegExp( '’', 'g' ),
    new RegExp( '\'', 'g' ),
    new RegExp( '᾽', 'g' ),
    new RegExp( '´', 'g' ),
    new RegExp( "‘", 'g' )
);
const regJotaSub = new RegExp( '\u{0345}', 'g' );
// precompiled regular expressions
/*const strClean1 = new RegExp( '’', 'g' );
const strClean2 = new RegExp( '\'', 'g' );
const strClean3 = new RegExp( '᾽', 'g' );
const strClean4 = new RegExp( '´', 'g' );
const strClean5 = new RegExp( "‘", 'g' );*/
const numeringReg1 = new RegExp( '\[[0-9]+\]', 'g' );
const numeringReg2 = new RegExp( /\[[M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})]+\]/, 'g' );

// precompiled regular expressions of the relevant ligatures 
const regEstigma = new RegExp( '\u{03DA}', 'g' ); 
const regEstigmakl = new RegExp( '\u{03DB}', 'g' );
const regEomikonyplsi = new RegExp( 'ȣ', 'g' );
const regEomikonyplsiK = new RegExp( 'Ȣ', 'g' );
const regEUk = new RegExp( 'Ꙋ', 'g' );
const regEuk = new RegExp( 'ꙋ', 'g' );
const regEkai = new RegExp( 'ϗ', 'g' );
const regEKai = new RegExp( 'Ϗ', 'g' );
const regEl1 = new RegExp( '\u{0223}', 'g' );
const regEl2 = new RegExp( '\u{0222}', 'g' );

const regEdoppelP = new RegExp( ':', 'g' );
const regEeinfahP = new RegExp( '\\.', 'g' );
const regEkomma = new RegExp( ',', 'g' );
const regEsemiK = new RegExp( ';', 'g' );
const regEhochP = new RegExp( '·', 'g' );
const regEausr = new RegExp( '!', 'g' );
const regEfarge = new RegExp( '\\?', 'g' );
const regEan1 = new RegExp( '“', 'g' );
const regEan5 = new RegExp( '„', 'g' );
const regEan2 = new RegExp( '”', 'g' );
const regEan3 = new RegExp( '"', 'g' );
const regEan4 = new RegExp( "'", 'g' );
const regEan6 = new RegExp( '(\s*)[\∶|\⋮|\·|\⁙|;]+(\s*)', 'g' );


const regU1 = new RegExp( "†", 'g' );
const regU2 = new RegExp( "\\*", 'g' );
const regU3 = new RegExp( "⋖", 'g' );
const regU4 = new RegExp( "#", 'g' ); 

const regEtailingsig = new RegExp( "ς", 'g' );

const regEkla1 = new RegExp( "\\(", 'g' );
const regEkla2 = new RegExp( "\\)", 'g' );
const regEkla3 = new RegExp( "\\{", 'g' );
const regEkla4 = new RegExp( "\\}", 'g' );
const regEkla5 = new RegExp( "\\[", 'g' );
const regEkla6 = new RegExp( "\\]", 'g' );
const regEkla7 = new RegExp( "\\<", 'g' );
const regEkla8 = new RegExp( "\\>", 'g' );
const regEkla9 = new RegExp( "⌈", 'g' );
const regEkla10 = new RegExp( "⌉", 'g' );
const regEkla11 = new RegExp( "‹", 'g' );
const regEkla12 = new RegExp( "›", 'g' );
const regEkla13 = new RegExp( "«", 'g' );
const regEkla14 = new RegExp( "»", 'g' );
const regEkla15 = new RegExp( "⟦", 'g' );
const regEkla16 = new RegExp( "⟧", 'g' );

const regEuv = new RegExp( "u", 'g' );

//original abschrift, Klammerbehandlungfließtext


//******************************************************************************
// Section 000
// basic UNICODE NORMAL FORM / TRANSLITERATION
//******************************************************************************
function setAnaFormTO( fnew ){
    analysisNormalform = fnew;
}

function setDisplFormTO( fnew ){
    dispnormalform = fnew;
}

function normarrayk( aarray ){
	let replacearray = new Object( );
	for( let p in aarray ){
		replacearray[ disambiguDIAkritika( p.normalize( analysisNormalform ) ) ] = aarray[ p ];
	}
	return replacearray;
}

function normarrayval( aarray ){ // by reference ????
    for( let p in aarray ){
        aarray[ p ] = aarray[ p ].normalize( analysisNormalform );
    }
}

// function takes sting and normalform string (for example "NFD")
function normatextwordbyword( text, wichnorm ){
    let spt = text.split( " " );
    const lele = spt.length;
    for( let w = 0; w < lele; w++ ){
        let nw = normatext( spt[ w ], wichnorm );
        spt[ w ] = nw;
    }
    return spt.join( " " )
}

function normatext( text, wichnorm ){
    return text.normalize( wichnorm );
}



function disambiguDIAkritika( astr ){
    astr = astr.split( "\u0027" ).join( "\u2019" ); //typogra korrektes postroph;
    astr = astr.split( "'" ).join( "\u2019" );
    astr = astr.split( "\u1FBD" ).join( "\u2019" );
    return astr;
}

function ExtractDiafromBuchst( buchst ){ //input as string
    let toitter = buchst.normalize( "NFKD" ).split( "" );
    let b = [];
    let d = [];
    for( let t in toitter ){
        let co =  toitter[t].toLowerCase( );
        if( buchstGRI[ co ] || buchsCoptic[ co ] || buchstLAT[ co ] ){
            b.push( toitter[t] );
        } else {
            d.push( toitter[t] );
        }
    }
    return [d.join(""), b.join("")];
}

function ExtractDiafromBuchstText( atext ){
    let t = "";
    let spli = atext.split( " " );
    for( let i in spli ){
        t += JSON.stringify( ExtractDiafromBuchst( spli[ i ] ) );
    }
    return t;
}

function replaceBehauchung( adiakstring ){
    if( adiakstring.indexOf( "῾" ) !== -1 ){
        return "h"+adiakstring.replace( "῾","" );
    } else {
        return adiakstring;
    }
}

//replace a elision
function Expandelision( aword ){
    //if word in listofelusion
    let t = listofelusion[ aword ];
    if( t ){
        return t;
    } else {
        return aword;
    }
}

function ExpandelisionText( atext ){
    let t = "";
    let wds = atext.split( " " );
    for( let w in wds ){
        t += " "+ Expandelision(  wds[ w ] );
    }
    return t;
}

function TraslitAncientGreekLatin( astring ){
    //if( notgreek ){
    //    return astring;
    //}
    //console.log(astring);
    let wordlevel = delligaturen( iotasubiotoad( astring.trim().normalize( "NFD" ) ).normalize( "NFC" ) ).split(" "); //care for iotasubscriptum, Ligature
    //console.log(wordlevel);
    //de !!!
    let romanized = [];
    for( let w in wordlevel ){
        
        let buchstlevel = Expandelision( wordlevel[ w ] ).split("");
        //console.log(buchstlevel);
        let grouped = [];
        let notlastdone = true;
        let extractedida2 = "";
        let extracteBUCHST2 = "";
        const lele = len( buchstlevel );
        for( let b = 1; b < lele; b+=1 ){
            if( buchstlevel[ b-1 ] === "" ){
                continue;
            }
            let zwischenerg1 = ExtractDiafromBuchst( buchstlevel[ b-1 ] );
            let zwischenerg2 = ExtractDiafromBuchst( buchstlevel[ b ] );
            let extractedida1 = zwischenerg1[0];
                extractedida2 = zwischenerg2[0];
            let extracteBUCHST1 = zwischenerg1[1];
                extracteBUCHST2 = zwischenerg2[1];
            //console.log(zwischenerg1, zwischenerg2);
            if( groups[extracteBUCHST1+extracteBUCHST2] && extractedida2.indexOf( "¨" ) === -1 ){ //wenn kein trema über dem zweiten buchstaben - diaresis keine Zusammenziehung (synresis)
                let gou = groups[ extracteBUCHST1+extracteBUCHST2 ];
                grouped.push( (gou[0]+replaceBehauchung(extractedida1)+gou[1]+replaceBehauchung(extractedida2)).normalize( "NFC" ) );
                buchstlevel[ b ] = "";//delet alread in groupand revistible
                notlastdone = false;
            } else {
                if( buchstGRI[extracteBUCHST1] ){
                    grouped.push( (buchstGRI[extracteBUCHST1]+replaceBehauchung(extractedida1)).normalize( "NFC" ) );
                } else {
                    if( buchsCoptic[extracteBUCHST1] ){
                        grouped.push( (buchsCoptic[extracteBUCHST1]+replaceBehauchung(extractedida1)).normalize( "NFC" ) );
                    } else {
                        //realy not - leave IT
                        grouped.push( buchstlevel[ b-1 ] );
                    }
                }
                notlastdone = true;
            }
        }
        if( notlastdone ){
            if( buchstGRI[extracteBUCHST2] ){
                    grouped.push( (buchstGRI[extracteBUCHST2]+replaceBehauchung(extractedida2)).normalize( "NFC" ) );
                } else {
                    if( buchsCoptic[extracteBUCHST2] ){
                        grouped.push( (buchsCoptic[extracteBUCHST2]+replaceBehauchung(extractedida2)).normalize( "NFC" ) );
                    } else {
                        //realy not - leave IT
                        grouped.push( buchstlevel[ buchstlevel.length-1 ] );
                    }
                }
        }
        romanized.push( grouped.join("") );
    }
    return romanized.join( " " );  
}

//******************************************************************************
// Section 00 
// basic cleaning and string conversion via regexp 
//******************************************************************************
function spitzeklammernHTML( astr ){
    return astr.replace( escspitzeL, '&lt;' ).replace( escspitzeR, '&gt;' );
}

//basic equalisation and hypenation reversion
function basClean( astring ){
    astring = astring.replace(cleanNEWL, " <br/>").replace(cleanRETL, " <br/>").replace(cleanstrangehochpunkt,"·").replace(cleanthisbinde," — ").replace( cleanthisleer, ' ').replace( cleanleerpunkt, '.').replace( cleanleerdoppelpunkt, ':').replace( cleanleerkoma, ',').replace( cleanleersemik, ';').replace( cleanleerausrufe, '!').replace( cleanleerfrege, '?').replace(cleangeviert, '-').replace(cleanhalbgeviert, '-').replace(cleanziffbreitergeviert, '-').replace(cleanviertelgeviert, '-').replace(cleanklgeviert, '-').replace(cleanklbindstrichkurz, '-').replace(cleanklbindstrichvollbreit, '-');

    // remove hyphens
    let ws = astring.split(" ");
        let ca = [];
        let halfw = "";
        let secondhalf = "";
        for( let w in ws ){
            if( ws[w].indexOf( "-" ) !== -1 ){
                let h = ws[w].split( "-" );
                halfw = h[0].replace(" ", "");
                secondhalf = h[1].replace(" ", "");
                if( secondhalf.indexOf("]") !== -1 ){ 
                    let hh = h[1].split("]");
                    if( hh[1].length > 1 ){
                        ca.push( halfw + hh[1] + " " + hh[0] + "]<br/>" );
                        halfw = "";
                        secondhalf = "";
                    }
                }
            } else if ( "<br/>" !== ws[w] && ws[w] !== "" && ws[w] !== " " && halfw !== "" ){
                if( ws[w].indexOf("]") !== -1 ){
                
                    secondhalf = ws[w].replace(" ", "");
                } else {
                    ca.push( halfw + ws[w].replace("<br/>", "") + " " + secondhalf + "<br/>" ); //trennstriche
                    halfw = "";
                    secondhalf = "";
                }
            } else {
                if( ws[w] !== "" ){ //remove mehrfache leerstellen
                    ca.push( ws[w] );
                }
            }
        }
        return ca.join( " " );
}

function ohnesatzzeichen( wliste ){
	for(let sa in satzzeichen ){
		for( let w in wliste){
			wliste[ w ] = wliste[ w ].split( satzzeichen[ sa ] ).join( "" );
		}
	}
	return wliste;
}

//******************************************************************************
// Section 0
// word leve conversions: 
// alpha privativum
// alpha copulativum
// Klammersysteme
//******************************************************************************

function AlphaPrivativumCopulativum( aword ){ //just works on NFC and NFKC
    if( notprivalpha.includes( aword ) === false ){
        let buchs = delall( aword ).split( "" );
        if( buchs[0] === "α" ){ //erste Buchstabe alpha
            if( hasKEY( vokaleGRI , buchs[1] ) ){ // zweiter ein Vokal
                let b2dia = ExtractDiafromBuchst(aword[1])[0];
                //let b1dia = ExtractDiafromBuchst(aword[0])[0]; 
                //console.log(  "zweiter vokal", ""b2dia, b2dia.indexOf(  "\u0308" )) 
                //insert the https://de.wikipedia.org/wiki/Unicodeblock_Kombinierende_diakritische_Zeichen
                if( b2dia.indexOf( "\u0308" ) !== -1  ){ //zweiter Buchstabe mit Trema, erste Buchstabe mit spiritus lenis
                    return aword[0] +" "+ aword.slice(1) ;
                } else { //
                    return aword;
                }
            } else {
                return aword;
            }
        } else {
            return aword;
        }
    } else {
        return aword;
    }
        
}

function AlphaPrivativumCopulativumText( atext ){
    let t = "";
    let spli = atext.split( " " );
    for( let l in spli ){
        t += " "+AlphaPrivativumCopulativum( spli[ l ] );
    }
    return t;
}


//KLAMMERSYSTEME HIER BEHANDELN

//******************************************************************************
// Section 1 
// unicode related comparing and norming, handling of diacritics
//******************************************************************************

// function takes string, splits it with jota subscriptum and joins the string again using jota adscriptum
function iotasubiotoad( aword ){
 	return aword.split( "\u0345" ).join( "ι" );
}

// function takes "one word"
function ohnediakritW( aword ){
    for( let dia in diacriticsunicodeRegExp ){
		aword = aword.replace( diacriticsunicodeRegExp[ dia ], "" );
	}
	return aword;
}

function capitali( astring ) {
    return astring.charAt(0).toUpperCase() + astring.slice(1).toLowerCase();
}

// function takes a string replaces some signs with regexp and oth
function nodiakinword( aword ){
    //let spt = ((aword.replace(strClean1, "").replace(strClean2, "").replace(strClean3, "").replace(strClean4, "")).normalize( analysisNormalform ));
    //return iotasubiotoad( ohnediakritW( spt ) );
    return iotasubiotoad( ohnediakritW( aword.normalize( analysisNormalform ) ) );
}

//******************************************************************************
// Section 2: deleting things that could be not same in two texts
//******************************************************************************

// function take a string and deletes diacritical signes, ligatures, remaining interpunction, line breaks, capital letters to small ones, equalizes sigma at the end of greek words, and removes brakets
function delall( text ){
    if( doUVlatin ){ // convert u to v in classical latin text
        text = deluv( delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( delmakup( delnumbering( delunknown( deldiak(  text)))))))))));
    } else {
        text = delklammern( sigmaistgleich( delgrkl( delumbrbine( delligaturen( delinterp( delmakup( delnumbering( delunknown( deldiak(  text  ) ) ) ) ) ) ) ) ) );
    }
    return text;
}

//run this before the klammern deletion
function delnumbering( text ){ //untested
    return text.replace( numeringReg1,"" ).replace( numeringReg2,"" );
}

// function take a string and replaces all occorences of a regular expression
function delligaturen( text ){
    return text.replace( regEstigma, "στ").replace( regEstigmakl, "στ").replace( regEUk, "Υκ").replace( regEuk, "υκ").replace(regEomikonyplsi, "ου").replace(regEomikonyplsiK, "ου").replace(regEkai, "καὶ").replace(regEKai, "Καὶ").replace(regEl1, "\u039F\u03C5" ).replace(regEl2, "\u03BF\u03C5" );
}

// function takes string and splits it into words, than normalizes each word, joins the string again
function deldiak( text ){
    let spt = text.split( " " ); //seperate words
    const lele = spt.length;
    for( let wi = 0; wi < lele; wi++ ){
        spt[ wi ] = nodiakinword( spt[ wi ] );
    }
    return  spt.join( " " );
}    

// function takes a string and replaces interpunction
function delinterp( text ){
    return text.replace(regEdoppelP, "").replace(regEeinfahP, "").replace(regEkomma, "").replace(regEsemiK, "").replace(regEhochP, "").replace(regEausr, "").replace(regEfarge, "").replace(regEan1, "").replace(regEan2, "").replace(regEan3, "").replace(regEan4, "").replace(regEan5, "").replace(regEan6, "");
}

// function takes a string and replaces some unknown signs
function delunknown( text ){
    return text.replace(regU1, "").replace(regU2, "").replace(regU3, "").replace(regU4, "");
}


// function takes string and replace html line breakes
function delumbrbine( text ){
    return text.replace(regEbr1, "").replace(regEbr2, "");
}

//more to come

function delmakup( text ){
    return text.replace(cleanhtmltags, "").replace(cleanhtmlformat1, "");
}

// ...
function delgrkl( text ){
    return text.toLowerCase();
}

// function takes string and converts tailing sigma to inline sigma (greek lang)
function sigmaistgleich( text ){
    return text.replace(regEtailingsig, "σ");
}


// function take sstring and replaces the brakets -- do not run this before the Klammersystem fkt
function delklammern( text ){
    return text.replace(regEkla1, "").replace(regEkla2, "").replace(regEkla3, "").replace(regEkla4,"").replace(regEkla5,"").replace(regEkla6,"").replace(regEkla7,"").replace(regEkla8,"").replace(regEkla9,"").replace(regEkla10,"").replace(regEkla11,"").replace(regEkla12,"").replace(regEkla13,"").replace(regEkla14,"").replace(regEkla15,"").replace(regEkla16,"");
}

// function takes string and replaces u by v, used in classical latin texts
function deluv( text ){
    return text.replace( regEuv, "v" );
}

//some bundels
function Trennstricheraus( wliste ){
	let ersterteil = "";
	let zweiterteil = "";
	let neueWLISTE = [];
    const lele = wliste.length;
	for(let w = 0; w < lele; w++){
		if( ersterteil.length === 0 ){
			if( wliste[ w ].indexOf( "-" ) !== -1 ){
				let eUNDz = wliste[ w ].split( "-" );
				if( eUNDz[1].length > 0 ){
					let zweiohnenewline = eUNDz[1].split( "\n" );
			 		neueWLISTE.push( eUNDz[0]+zweiohnenewline[ zweiohnenewline.length-1 ] );
				} else {
					ersterteil = eUNDz[0];
				}
				//console.log(eUNDz.length, eUNDz);
			} else { //nix - normales wort
				neueWLISTE.push( wliste[ w ] );
			}
		} else { // es gab eine Trennung und die ging über zwei Listenzellen
			if( wliste[ w ].indexOf( "[" ) === -1 && wliste[ w ].indexOf( "]" ) === -1){
				let zweiteralsliste = wliste[ w ].split( "\n" );
				//console.log("split", zweiteralsliste, wliste[ w ], ersterteil+zweiteralsliste[ zweiteralsliste.length-1 ]);
				neueWLISTE.push( ersterteil+zweiteralsliste[ zweiteralsliste.length-1 ] );
				ersterteil = "";
			} else { //klammern behandeln
					 //wenn ich hier kein push auf der neune Wortliste mache, dann lösche ich damit die geklammerten sachen

				if( wliste[ w ].indexOf( "[" ) !== -1 && wliste[ w ].indexOf( "]" ) !== -1 ){ //klammern in einem Wort
					let zweiteralsliste = wliste[ w ].split( "]" );
				
					neueWLISTE.push( ersterteil+zweiteralsliste[1].substring(1, zweiteralsliste[1].length-1) );
					//console.log("NO SPLIT", ersterteil+zweiteralsliste[1].substring(1, zweiteralsliste[1].length-1));
				} else if( wliste[ w ].indexOf( "[" ) !== -1 ){
					let zweiteralsliste = wliste[ w ].split( "[" );
					neueWLISTE.push( ersterteil+zweiteralsliste.join("") );
				} else { //nur schließende Klammer
					let zweiteralsliste = wliste[ w ].split( "]" );
					neueWLISTE.push( ersterteil+zweiteralsliste[1] );
					//console.log("NO SPLIT", ersterteil+zweiteralsliste[1].substring(1, zweiteralsliste[1].length-1));
				}
			}
		}
	}
	return neueWLISTE;
}

function UmbruchzuLeerzeichen( atext ){
	atext = atext.split("\n").join( " " );
	return atext;
}

function Interpunktiongetrennt( wliste ){
    let neuewliste = [];
    for( let sa in satzzeichen ){
        for(let w in wliste ){
            if( wliste[ w ].indexOf( satzzeichen[ sa ] ) !== -1 ){
                neuewliste.push( wliste[ w ].split( satzzeichen[ sa ] ).join( "" ) );
                neuewliste.push( satzzeichen[ sa ] );
            } else {
                neuewliste.push(  wliste[ w ] );
            }
        }
        wliste = neuewliste;
        neuewliste = [];
    }
	return wliste;
}

/*function Klammernbehandeln( wliste ){
	let neueWliste = [];
	for(let w in wliste ){
		// wenn die eckigen KLammern in einem Wort sthen, dann werte es als Zählung - einfahcste Weise
		if( (wliste[w].indexOf("]") !== 0 && wliste[w].indexOf("[") !== 0) ){
			neueWliste.push(wliste[w]);
		}
	}
	return neueWliste;
}*/

function iotasubiotoadL( wliste ){
	for( let w in wliste){
		wliste[ w ] = iotasubiotoad( wliste[ w ] );
	}
	return wliste;
}

//function to use with greek text maybe
function GRvorbereitungT( dtext ){
	let diewo =  disambiguDIAkritika( delnumbering(dtext).normalize( analysisNormalform ).toLowerCase() ).split( " " );
		//diewo = iotasubiotoadL( diewo );
		diewo = UmbruchzuLeerzeichen( Trennstricheraus( diewo ).join( " " ) ).split( " " );
		diewo = Interpunktiongetrennt( diewo );
		//diewo = Klammernbehandeln( diewo );
	return diewo;
} 

//******************************************************************************
// Section 3: edition klammerung
//******************************************************************************
//Inschriften / Papyri / Ostraka signis criticis
//https://apps.timwhitlock.info/js/regex#
/*LUECKEN*/
const lueckeBestimmt = new RegExp( /(?<!〚|\[)\[(---)*[a-zA-ZͰ-Ͼἀ-῾, ,\?:;\(\)◌̅◌̲]+(---)*[a-zA-ZͰ-Ͼἀ-῾, ,\?:;\(\)◌̅◌̲]*\](?!〛|\])/, 'g' ); //luebest, Findet verschachtelte eckige Klammern NICHT!!! also die äußersten - Idee; Newline!!!
const lueckevoe = new RegExp( /\[[Ͱ-Ͼἀ-῾◌̣ ]+-\]/, 'g' ); //luebestvoe 
const lueckebestlen = new RegExp( /(?<!〚)\[\.+\](?!〛)/, 'g' ); //luebestlen, luecke bestimmter länge
const lueckeinZeile = new RegExp( /(?<!〚)\[---\](?!〛)/, 'g' ); 
//const lueckeinZeile2 = new RegExp(/\[3\]/, 'g' ); 
const lueckeausZeile = new RegExp( /(?<!〚)\[[\s]*------[\s]*\](?!〛)/, 'g' ); 
//const lueckeausZeile2 = new RegExp( /\[6\]/, 'g' ); 
const lueckeausmehrZeile = new RegExp( /(?<![(〚\[)\[⟨])[\s]*------[\s]*(?![(\]〛)\]⟩])/, 'g' ); 
const lueckeunbest = new RegExp( /\]\[/, 'g' ); //|[__]+|[\_]+/, 'g' ); 
const lueckmlen = new RegExp( /\[[a-zA-ZͰ-Ͼἀ-῾, ,\?:;\(\)◌̅◌̲]*[\s]*\-[\s]*ca[.\s\d\?]+[\s]*\-[\s]*[a-zA-ZͰ-Ͼἀ-῾, ,\?:;\(\)◌̅◌̲]*\]/, 'g' ); 
/*Zeilen und Spalten*/
const zeilenende = new RegExp( /\s\/[\s\n]+/, 'g' ); 
const zeilenendeDigit = new RegExp( /\s\/(\d)+[\s\n]+/, 'g' ); 
const zeilenanfang = new RegExp( /\s\|[\s\n]+/, 'g' );
const zeilenanfangDigit = new RegExp( /\|\d+/, 'g' ); 
const spaltenanfang = new RegExp( /\s\|\|[\s\n]+|\s\/\/[\s\n]+/, 'g' ); 
/*einzelne Buchstaben*/
const punktunter = new RegExp( "[Ͱ-Ͼἀ-῾][\u{0323}]", 'g' ); 
const frueheregewaer = new RegExp( /[◌̲]/, 'g' );
const unbekueber = new RegExp( /[◌̅]+/, 'g' );
const unterpunkteinzelstehend = new RegExp( " +\u{0323}", 'g' ); 
const anzgriechbuch = new RegExp( /(?<![\[〚])\.\.+(?![\]〛])/, 'g' );//  Litterarum vestigia
const anzlatbuchs = new RegExp( /\++/, 'g' ); //ein oder mehrer; das ist zwei oder mehrere \+[\+]+ 
/*Tilgung, willentlicher Verlust*/
const irrgetilgt = new RegExp( /\{[a-zA-ZͰ-Ͼἀ-῾, ,\?:;\(\)◌̅◌̲◌̣ ]+\}/, 'g' ); // Irrtümlich hinzugefügte Buchstaben, die der Herausgeber getilgt hat
const tilg = new RegExp( /〚(?<!\[)[a-zA-ZͰ-Ͼἀ-῾, .,\?:;\(\)◌̅◌̲◌̣ ]+(?!\])〛/, 'g' ); //antike Tildung
const rasiert = new RegExp( /\[\[+[a-zA-ZͰ-Ͼἀ-῾, ,\?:;\(\)◌̅◌̲◌̣ ]*\]+\]/, 'g' ); //Rasur, was ist mit dreifacher Klammerung
const tilgerg = new RegExp( /〚\[[a-zA-ZͰ-Ͼἀ-῾, ,\?:;\(\)◌̅◌̲]+\]〛/, 'g' ); //antike Tildung erg heraus
const tilguns = new RegExp( /〚\[\.\.\.\]〛|〚\[\-5\?\-\]〛|〚\[\-\-\-\]〛/, 'g' ); //
const tilgzei = new RegExp( /〚\[\-\-\-\-\-\-\]〛/, 'g' ); //Tilgung Zeile 
/*Wieder hergestellt (nach Tilgung)*/
const editorrekonst = new RegExp( /⎣[a-zA-ZͰ-Ͼἀ-῾, .,\?:;\(\)◌̅◌̲◌̣ ]+⎦/, 'g' ); //durch den Editor wieder hergestellet
const recovori = new RegExp( /⌈[a-zA-ZͰ-Ͼἀ-῾, .,\?:;\(\)◌̅◌̲◌̣ ]+⌉/, 'g' ); //aus dem Original rekonstruiert
const ueberschr = new RegExp( /&lt;&lt;[a-zA-ZͰ-Ͼἀ-῾, .,\?:;\(\)◌̅◌̲◌̣ ]+&gt;&gt;/, 'g' ); // Hier sind Texte aufgeführt, die - vor allem in der Severerzeit - anstelle getilgter Passagen eingefügt worden sind.
const tilgrewrite = new RegExp( /(&lt;&lt;\[\[)[a-zA-ZͰ-Ͼἀ-῾, .,\?:;\(\)◌̅◌̲◌̣ \n]+(\]\]&gt;&gt;)/, 'g' ); //Der Text wurde zunächst getilgt und dann wieder eingemeißelt; häufig leg. III
const wiederherst = new RegExp( /《[a-zA-ZͰ-Ͼἀ-῾, ,\?:;\(\)◌̅◌̲◌̣ ]+》/, 'g' ); //
const korr = new RegExp( /&lt;[a-zA-ZͰ-Ͼἀ-῾, .,\?:;\(\)◌̅◌̲◌̣ \n]+\=[a-zA-ZͰ-Ͼἀ-῾, .,\?:;\(\)◌̅◌̲◌̣ \n]+&gt;/, 'g' ); //Korrektur (Beispiel: f<e=F>cit für FFCIT)
const erszuff = new RegExp( /《\[[a-zA-ZͰ-Ͼἀ-῾, .,\?:;\(\)◌̅◌̲◌̣ \n]+\]》/, 'g' ); //Ersatz für getilgte Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind und die der Herausgeber ergänzt hat
const erzuffunbst = new RegExp( /《\[\.\.\.\]》|《\[\-5\?\-\]》|《\[---\]》/, 'g' ); //Ersatz für getilgte Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind und deren Anzahl sich sicher, weniger sicher oder gar nicht berechnen läßt
/*Angaben des Editors*/
const aufabk = new RegExp( /\([a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \n]+\)/, 'g' );  //Auflösung von Abkürzungen, Abgekürztes Wort, das der Herausgeber aufgelöst hat, doppelte Klammerung ist noch nicht gelöst
const aufabkuns = new RegExp( /\([a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \n]+\-\)/, 'g' ); //Abgekürztes Wort, das der Herausgeber aufgelöst hat, doch ist die Deklinations- oder Konjugationsform unsicher
const scil = new RegExp( /\(scil\. [a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \n]+\)/, 'g' ); //Ein Wort, das nicht im Text steht, das aber stillschweigend zu verstehen ist und das der Herausgeber hinzugefügt hat
const unvollen = new RegExp( /⟨------\?*⟩|⟨---\?*⟩/, 'g' ); //Unvollendete Inschrift (die Inschrift bricht entweder innerhalb der Zeile oder am Zeilenende ab; in fraglichen Fällen mit ? vor der schließenden Klammer)
const hinwabk = new RegExp( /\s[a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \n]+\(\-\-\-\)\s/, 'g' ); //Abgekürztes Wort, das nicht sicher aufgelöst werden kann
const korrdeseditors = new RegExp( /(?<!&lt;)&lt;[a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \n]+&gt;(?!&gt;)|⟨[a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \n]+⟩/, 'g' ); //Irrtümlich ausgelassene Buchstaben, die der Herausgeber hinzugefügt hat
const ungewschreibung = new RegExp( /\(\s*\!\s*\)/, 'g'); //Unmittelbar an ein Wort anschließend markiert (!) eine ungewöhnliche Schreibweise wie Maxumus(!); isoliert stehend markiert (!) ein fehlendes Wort wie das fehlende f(ilius) in C(aius) Iulius C(ai) (!) Maximus.
const buchstherausrekonst = new RegExp( /˹[a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \n]+˺/, 'g' ); //Buchstaben, die der Herausgeber korrigiert hat
const eckenunbek = new RegExp(/˻[a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \n]+˼/, 'g');//?
const vac = new RegExp( /\(vac.(\s*\d*\?)*\)/, 'g' ); //Abschnitte einer Zeile, die nicht beschrieben gewesen zu sein scheinen und deren Ausdehnung – nach der Zahl der Buchstaben, die man darin hätte unterbringen können, berechnet – sicher oder weniger sicher oder gar nicht berechnet werden kann
const wtrenn = new RegExp( /[a-zA-ZͰ-Ͼἀ-῾, .,\?:;◌̅◌̲◌̣ \[\]\(\)]+\=[\s\n]+/, 'g' ); // Worttrennung

function applyklammregexpMark( id, ausdruck, stringtomani, index, legende ){ //insert marking html
    let out = "";
    let matches = stringtomani.match( ausdruck );
    let i = 0;
    let startindex = 0;
    while( ausdruck.exec( stringtomani ) ){
        let inserttext = matches[i];
        index[ id ].push([ausdruck.lastIndex-matches[i].length, ausdruck.lastIndex, matches[i].length, inserttext ] );
        out += stringtomani.slice(startindex, ausdruck.lastIndex - matches[i].length) +"<span class='"+id+"'>"+inserttext+"</span>";
        i+=1;
        startindex = ausdruck.lastIndex;
    }
    out += stringtomani.slice(startindex, stringtomani.length);
    return out;
}

function applyklammregexp( id, ausdruck, stringtomani, index, legende ){ //insert anchor
    let out = "";
    let matches = stringtomani.match( ausdruck );
    let i = 0;
    let startindex = 0;
    while( ausdruck.exec( stringtomani ) ){
        let howmuchbuchs = matches[i].length+1;
        //console.log(howmuchbuchs);
        if( howmuchbuchs <= 1 ){
            howmuchbuchs = 2;
        }
        let inserttext = stringtomani.slice(ausdruck.lastIndex - howmuchbuchs, ausdruck.lastIndex);
        
        index[ id ].push([ausdruck.lastIndex-howmuchbuchs, ausdruck.lastIndex, howmuchbuchs, inserttext ] );
        out += stringtomani.slice(startindex, ausdruck.lastIndex - matches[i].length) +inserttext+"<a class='anchorofindexentry' id='"+id+ausdruck.lastIndex.toString()+"' onclick='this.innerHTML=\"\";'></a>";
        i+=1;
        startindex = ausdruck.lastIndex;
    }
    out += stringtomani.slice(startindex, stringtomani.length);
    return out;
}

function hervKLAMMSYS( stringtomani ){ //RUN ON NFC/NFKC
    //index
    let index = { };
    let legende = { };
    let out = "";
    
    /*EINZELBUCHSTABEN ZEICHEN*/

    /*
    ◌̣
    Def: Unterpunkt, Lesung unsicher; aus dem Kontext erschlossen, Buchstaben, die derart beschädigt sind,
    daß sie nur im Kontext sicher identifiziert
    werden können
    HIER ZUR ZEIT EINZUELBUCHSTABEN AUSWAHL _ VIELLEICHT PRO WORT
    */
    index[ "punktunter" ] = [];
    legende[ "punktunter" ] = ["ẹ", "Unterpunkt, Lesung unsicher; aus dem Kontext erschlossen, Buchstaben, die derart beschädigt sind, daß sie nur im Kontext sicher identifiziert werden können."];
    out = applyklammregexp( "punktunter", punktunter, stringtomani, index, legende ); 

    /*
        ◌̲
        Def: Buchstaben, die von früheren Gewährsmännern gelesen und abgeschrieben wurden, aber später verlorengegangen sind. 


    */
    index[ "frueheregewaer" ] = [];
    legende[ "frueheregewaer" ] = ["e̲", "Buchstaben, die von früheren Gewährsmännern gelesen und abgeschrieben wurden, aber später verlorengegangen sind."];
    out = applyklammregexp( "frueheregewaer", frueheregewaer, out, index, legende );

    /*
    Überstrichen ‾
    Def: Besondere Buchstabenformen und Zahlen; Abkürzungen/Abbreviaturen in mittelalterlichen Handschriften.


    */
    index[ "unbekueber" ] = [];
    legende[ "unbekueber" ] = ["c̅", "Besondere Buchstabenformen und Zahlen; Abkürzungen/Abbreviaturen in mittelalterlichen Handschriften."];
    out = applyklammregexp( "unbekueber", unbekueber, out, index, legende );
    
    /*
        +++ 
        Def: Spuren von Buchstaben, die derart in 
        Mitleidenschaft gezogen sind, daß sie 
        nicht identifiziert werden können.  
    */
    index[ "anzlatbuchs" ] = [];
    legende[ "anzlatbuchs" ] = ["+++", "Spuren von Buchstaben, die derart in Mitleidenschaft gezogen sind, daß sie nicht identifiziert werden können."];
    out = applyklammregexp( "anzlatbuchs", anzlatbuchs, out, index, legende );  
 
    /*
        Punktserien, auch Unterpunkte mit Leerzeichen, die werden vorher ersetzt. Def: Litterarum vestigia 
    */
    index[ "anzgriechbuch" ] = [];
    legende[ "anzgriechbuch" ] = ["...", "Punktserie, Litterarum vestigia."];
    out = applyklammregexp( "anzgriechbuch", anzgriechbuch, out.replace( unterpunkteinzelstehend, "." ), index, legende );  

    /*
        unterstrichene Buchstaben 
    */
    /*LÜCKEN ALLER ART*/

    /*Luecke bestimmt aber

    [abc]
    Def: Buchstaben, die infolge einer zufaelligen Beschaedigung der Oberfläche voellig 
    verschwunden oder am Rande weggebrochen sind und die der Herausgeber ergaenzt hat

    */
    index["luebest"] = []; //initialize space for index results
    legende["luebest"] = ["[abc]", "Buchstaben, die infolge einer zufaelligen Beschaedigung der Oberfläche voellig verschwunden oder am Rande weggebrochen sind und die der Herausgeber ergaenzt hat."];
    out = applyklammregexp( "luebest", lueckeBestimmt, out, index, legende );

    /*Luecke bestimmt aber

    [abc-]
    Def: Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig ver-
    schwunden oder am Rande weggebrochen sind und die der Herausgeber ergänzt
    hat, doch ist die Deklinations- oder Konjugationsform unsicher; wird auch
    gesetzt, wenn die Wurzel eines Wortes sicher, aber das aus dieser Wurzel abgelei-
    tete Wort unsicher ist, außerdem wenn im Falle einer möglichen Abkürzung eines
    Wortes unbekannt ist, wieviele Buchstaben des Wortes ausgeschrieben waren

    */
    index["luebestvoe"] = [];
    legende["luebestvoe"] = ["[abc-]","Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind und die der Herausgeber ergänzt hat, doch ist die Deklinations- oder Konjugationsform unsicher; wird auch gesetzt, wenn die Wurzel eines Wortes sicher, aber das aus dieser Wurzel abgeleitete Wort unsicher ist, außerdem wenn im Falle einer möglichen Abkürzung eines Wortes unbekannt ist, wieviele Buchstaben des Wortes ausgeschrieben waren."];
    out = applyklammregexp( "luebestvoe", lueckevoe, out, index, legende );

    /*
    [...]
    Def: Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig ver-
    schwunden oder am Rande weggebrochen sind und die der Herausgeber nicht
    ergänzen konnte, obwohl sich ihre Anzahl sicher berechnen läßt; für jeden Buch-
    staben wird ein Punkt gesetzt
     
    */
    index[ "luebestlen" ] = [];
    legende[ "luebestlen" ] = ["[...]", "Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind und die der Herausgeber nicht ergänzen konnte, obwohl sich ihre Anzahl sicher berechnen läßt; für jeden Buchstaben wird ein Punkt gesetzt."];
    out = applyklammregexp( "luebestlen", lueckebestlen, out.replace( unterpunkteinzelstehend, "." ), index, legende );

    /*

     [-ca.16 -]
    Def: Unbestimmte Lücke, vermutete Anzahl von Buchstaben der Lücke in einer Zeile.
    */
    index[ "lueckmlen" ] = [];
    legende[ "lueckmlen" ] = ["[-ca.16 -]", "Unbestimmte Lücke, vermutete Anzahl von Buchstaben der Lücke in einer Zeile."];
    out = applyklammregexp( "lueckmlen", lueckmlen, out, index, legende );
    /* 
    [---] 
    Def: unbestimmte, unerkennbare Länge einer Lücke in einer Zeile

    Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig ver-
    schwunden oder am Rande weggebrochen sind, die der Herausgeber nicht ergänzt
    hat und deren Anzahl sich ungefähr oder gar nicht berechnen läßt
    */
    index[ "lueckeinZeile" ] = [];
    legende[ "lueckeinZeile" ] = ["[---]", "Unbestimmte, unerkennbare Länge einer Lücke in einer Zeile. Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind, die der Herausgeber nicht ergänzt hat und deren Anzahl sich ungefähr oder gar nicht berechnen läßt."];
    out = applyklammregexp( "lueckeinZeile", lueckeinZeile, out, index, legende );
    /* 
    [------] 
    Def: Lücke unbestimmter Länge
    */
    index[ "lueckeausZeile" ] = [];
    legende[ "lueckeausZeile" ] = ["[------]", "Lücke unbestimmter Länge."];
    out = applyklammregexp( "lueckeausZeile", lueckeausZeile, out, index, legende );
    /*

    ------

    Def: Lücke einer ganzen Zeile bzw. Lücke ganzer Zeilen, deren Anzahl unsicher ist

    */
    index[ "lueckeausmehrZeile" ] = [];
    legende[ "lueckeausmehrZeile" ] = ["------", "Lücke einer ganzen Zeile bzw. Lücke ganzer Zeilen, deren Anzahl unsicher ist."];
    out = applyklammregexp( "lueckeausmehrZeile", lueckeausmehrZeile, out, index, legende );
    /*
    ][ Lücke unbestimmt
    */
    index[ "lueckeunbest" ] = [];
    legende[ "lueckeunbest" ] = ["][", "Lücke unbestimmt"];
    out = applyklammregexp( "lueckeunbest", lueckeunbest, out, index, legende );

    /*TILGUNG ALLER ART*/

    /*
        {}
        Def: Irrtümlich hinzugefügte Buchstaben, die der Herausgeber getilgt hat

    */
    index[ "irrgetilgt" ] = [];
    legende[ "irrgetilgt" ] = ["{abc}", "Irrtümlich hinzugefügte Buchstaben, die der Herausgeber getilgt hat."];
    out = applyklammregexp( "irrgetilgt", irrgetilgt, out, index, legende );
    /*
        〚 〛 
        Def: In der Antike getilgte Buchstaben, die trotzdem deutlich oder mit Wahrscheinlich-
        keit zu lesen sind
    */
    index[ "tilg" ] = [];
    legende[ "tilg" ] = ["〚abc〛", "In der Antike getilgte Buchstaben, die trotzdem deutlich oder mit Wahrscheinlichkeit zu lesen sind."];
    out = applyklammregexp( "tilg", tilg, out, index, legende );

    /*
        [[ ]]
        Def: Rasur; In der Antike getilgte Buchstaben, die trotzdem deutlich oder mit Wahrscheinlichkeit zu lesen sind.
    */
    index[ "rasiert" ] = [];
    legende[ "rasiert" ] = ["[[abc]]", "Rasur; In der Antike getilgte Buchstaben, die trotzdem deutlich oder mit Wahrscheinlichkeit zu lesen sind."];
    out = applyklammregexp( "rasiert", rasiert, out, index, legende );
    /*
        〚[] 〛
        Def: In der Antike getilgte Buchstaben, die der Herausgeber ergänzt hat
    */
    index[ "tilgerg" ] = [];
    legende[ "tilgerg" ] = ["〚[abc] 〛", "In der Antike getilgte Buchstaben, die der Herausgeber ergänzt hat."];
    out = applyklammregexp( "tilgerg", tilgerg, out, index, legende );
    /*
        〚[...] 〛, 〚[-5?-] 〛, 〚[---] 〛
        Def: In der Antike getilgte Buchstaben, deren Anzahl sich sicher, weniger sicher oder
        gar nicht berechnen läßt
    */
    index[ "tilguns" ] = [];
    legende[ "tilguns" ] = ["〚[...] 〛, 〚[-5?-] 〛, 〚[---] 〛", "In der Antike getilgte Buchstaben, deren Anzahl sich sicher, weniger sicher oder gar nicht berechnen läßt."];
    out = applyklammregexp( "tilguns", tilguns, out, index, legende );
     /*
        〚[------] 〛
        Def: Lücke einer ganzen getilgten Zeile
    */
    index[ "tilgzei" ] = [];
    legende[ "tilgzei" ] = ["〚[------] 〛", "Lücke einer ganzen getilgten Zeile."];
    out = applyklammregexp( "tilgzei", tilgzei, out, index, legende );

    /*ERSATZ VON BUCHSTABEN UND LUECKEN / WIEDERHERSTELLUNG */

    /*
    《》
    Def: Ersatz für getilgte Buchstaben, die deutlich oder mit Wahrscheinlichkeit zu lesen
    sind*/
    index[ "wiederherst" ] = [];
    legende[ "wiederherst" ] = ["《abc》", "Ersatz für getilgte Buchstaben, die deutlich oder mit Wahrscheinlichkeit zu lesen sind."];
    out = applyklammregexp( "wiederherst", wiederherst, out, index, legende );
    /*
    ⎣⎦
    Def: Durch den Editor wieder hergestellet.*/
    index[ "editorrekonst" ] = [];
    legende[ "editorrekonst" ] = ["⎣abc⎦", "Durch den Editor wieder hergestellet."];
    out = applyklammregexp( "editorrekonst", editorrekonst, out, index, legende );
    /*
    ⌈⌉
    Def: Aus dem Original rekonstruiert.*/
    index[ "recovori" ] = [];
    legende[ "recovori" ] = ["⌈abc⌉", "Aus dem Original rekonstruiert."];
    out = applyklammregexp( "recovori", recovori, out, index, legende );
    /*
    <<>>
    Def: Buchstaben, die anstelle getilgter Passagen eingefügt worden sind.*/
    index[ "ueberschr" ] = [];
    legende[ "ueberschr" ] = ["&lt;&lt;abc&gt;&gt;", "Buchstaben, die anstelle getilgter Passagen eingefügt worden sind."];
    out = applyklammregexp( "ueberschr", ueberschr, out, index, legende );
    /*
    <<[[]]>>
    Def: Der Text wurde zunächst getilgt und dann wieder eingemeißelt; häufig leg. III.*/
    index[ "tilgrewrite" ] = [];
    legende[ "tilgrewrite" ] = ["&lt;&lt[[abc]]&gt;&gt;", "Der Text wurde zunächst getilgt und dann wieder eingemeißelt."];
    out = applyklammregexp( "tilgrewrite", tilgrewrite, out, index, legende );
     /*
    <a=b>
    Def: Korrektur (Beispiel: f<e=F>cit für FFCIT).*/
    index[ "korr" ] = [];
    legende[ "korr" ] = ["&lt;a=b&gt;", "Korrektur (Beispiel: f<e=F>cit für FFCIT)."];
    out = applyklammregexp( "korr", korr, out, index, legende );
    /*
    《[]》
    Def: Ersatz für getilgte Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind und die der Herausgeber ergänzt hat.*/
    index[ "erszuff" ] = [];
    legende[ "erszuff" ] = ["《[abc]》", "Ersatz für getilgte Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind und die der Herausgeber ergänzt hat."];
    out = applyklammregexp( "erszuff", erszuff, out, index, legende );
    /*
    《[...]》,《[-5?-]》,《[---]》
    Def: Ersatz für getilgte Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind und deren Anzahl sich sicher, weniger sicher oder gar nicht berechnen läßt.*/
    index[ "erzuffunbst" ] = [];
    legende[ "erzuffunbst" ] = ["《[...]》,《[-5?-]》,《[---]》", "Ersatz für getilgte Buchstaben, die infolge einer zufälligen Beschädigung der Oberfläche völlig verschwunden oder am Rande weggebrochen sind und deren Anzahl sich sicher, weniger sicher oder gar nicht berechnen läßt."];
    out = applyklammregexp( "erzuffunbst", erzuffunbst, out, index, legende );

    /*Angaben des Editors*/
    /*
    (abc)
    Def: Auflösung von Abkürzungen, Abgekürztes Wort, das der Herausgeber aufgelöst hat.*/
    index[ "aufabk" ] = [];
    legende[ "aufabk" ] = ["(abc)", "Auflösung von Abkürzungen, Abgekürztes Wort, das der Herausgeber aufgelöst hat."];
    out = applyklammregexp( "aufabk", aufabk, out, index, legende );
    /*
    (abc-)
    Def: Abgekürztes Wort, das der Herausgeber aufgelöst hat, doch ist die Deklinations- oder Konjugationsform unsicher.*/
    index[ "aufabkuns" ] = [];
    legende[ "aufabkuns" ] = ["(abc-)", "Abgekürztes Wort, das der Herausgeber aufgelöst hat, doch ist die Deklinations- oder Konjugationsform unsicher."];
    out = applyklammregexp( "aufabkuns", aufabkuns, out, index, legende );    
    /*
    (scil. abc)
    Def: Ein Wort, das nicht im Text steht, das aber stillschweigend zu verstehen ist und das der Herausgeber hinzugefügt hat.*/
    index[ "scil" ] = [];
    legende[ "scil" ] = ["(scil. abc)", "Ein Wort, das nicht im Text steht, das aber stillschweigend zu verstehen ist und das der Herausgeber hinzugefügt hat."];
    out = applyklammregexp( "scil", scil, out, index, legende );
    /*
    ⟨------⟩,⟨---⟩,⟨------?⟩,⟨---?⟩
    Def: Unvollendete Inschrift (die Inschrift bricht entweder innerhalb der Zeile oder am Zeilenende ab; in fraglichen Fällen mit ? vor der schließenden Klammer).*/
    index[ "unvollen" ] = [];
    legende[ "unvollen" ] = ["⟨------⟩,⟨---⟩,⟨------?⟩,⟨---?⟩", "Unvollendete Inschrift (die Inschrift bricht entweder innerhalb der Zeile oder am Zeilenende ab; in fraglichen Fällen mit ? vor der schließenden Klammer)."];
    out = applyklammregexp( "unvollen", unvollen, out, index, legende );
    /*
    abc(---)
    Def: Abgekürztes Wort, das nicht sicher aufgelöst werden kann.*/
    index[ "hinwabk" ] = [];
    legende[ "hinwabk" ] = ["abc(---)", "Abgekürztes Wort, das nicht sicher aufgelöst werden kann."];
    out = applyklammregexp( "hinwabk", hinwabk, out, index, legende );
    /*
    <abc>,⟨abc⟩
    Def: Irrtümlich ausgelassene Buchstaben, die der Herausgeber hinzugefügt hat.*/
    index[ "korrdeseditors" ] = [];
    legende[ "korrdeseditors" ] = ["&lt;abc&gt;, ⟨abc⟩", "Irrtümlich ausgelassene Buchstaben, die der Herausgeber hinzugefügt hat."];
    out = applyklammregexp( "korrdeseditors", korrdeseditors, out, index, legende );
    /*
    (!)
    Def: Unmittelbar an ein Wort anschließend markiert (!) eine ungewöhnliche Schreibweise wie Maxumus(!); isoliert stehend markiert (!) ein fehlendes Wort wie das fehlende f(ilius) in C(aius) Iulius C(ai) (!) Maximus.*/
    index[ "ungewschreibung" ] = [];
    legende[ "ungewschreibung" ] = ["(!)", "Unmittelbar an ein Wort anschließend markiert (!) eine ungewöhnliche Schreibweise wie Maxumus(!); isoliert stehend markiert (!) ein fehlendes Wort wie das fehlende f(ilius) in C(aius) Iulius C(ai) (!) Maximus."];
    out = applyklammregexp( "ungewschreibung", ungewschreibung, out, index, legende );
    /*
    ˹abc˺
    Def: Buchstaben, die der Herausgeber korrigiert hat.*/
    index[ "buchstherausrekonst" ] = [];
    legende[ "buchstherausrekonst" ] = ["˹abc˺", "Buchstaben, die der Herausgeber korrigiert hat."];
    out = applyklammregexp( "buchstherausrekonst", buchstherausrekonst, out, index, legende );
    /*
    ˻abc˼
    Def: Buchstaben, die der Herausgeber unter Benutzung anderer Zeugnisse korrigiert hat..*/
    index[ "eckenunbek" ] = [];
    legende[ "eckenunbek" ] = ["˻abc˼", "Buchstaben, die der Herausgeber unter Benutzung anderer Zeugnisse korrigiert hat."];
    out = applyklammregexp( "eckenunbek", eckenunbek, out, index, legende );
    /*
    (vac.), (vac. 3?)
    Def: vacat; Abschnitte einer Zeile, die nicht beschrieben gewesen zu sein scheinen und deren Ausdehnung – nach der Zahl der Buchstaben, die man darin hätte unterbringen können, berechnet – sicher oder weniger sicher oder gar nicht berechnet werden kann.*/
    index[ "vac" ] = [];
    legende[ "vac" ] = ["(vac.), (vac. 3?)", "vacat; Abschnitte einer Zeile, die nicht beschrieben gewesen zu sein scheinen und deren Ausdehnung – nach der Zahl der Buchstaben, die man darin hätte unterbringen können, berechnet – sicher oder weniger sicher oder gar nicht berechnet werden kann."];
    out = applyklammregexp( "vac", vac, out, index, legende );
    /*
    =
    Def: Worttrennung.*/
    index[ "wtrenn" ] = [];
    legende[ "wtrenn" ] = ["=", "Worttrennung."];
    out = applyklammregexp( "wtrenn", wtrenn, out, index, legende );

    /*Zeilen und Spalten*/
    /* 
        /
        Def: Zeilenende
    */ 
    index[ "zeilenende" ] = [];
    legende[ "zeilenende" ] = ["/", "Zeilentrenner; Zeilenende."];
    out = applyklammregexp( "zeilenende", zeilenende, out, index, legende );
    /* 
        /5
        Def: Zeilenende mit Zahl
    */ 
    index[ "zeilenendeDigit" ] = [];
    legende[ "zeilenendeDigit" ] = ["/5", "Zeilenende mit Numerierung."];
    out = applyklammregexp( "zeilenendeDigit", zeilenendeDigit, out, index, legende );
    /* 
        |
        Def: Zeilenanfang
    */ 
    index[ "zeilenanfang" ] = [];
    legende[ "zeilenanfang" ] = ["|", "Zeilentrenner; Zeilenanfang."];
    out = applyklammregexp( "zeilenanfang", zeilenanfang, out, index, legende ); 
    /* 
        |5
        Def: Zeilenanfang mit Numerierung
    */ 
    index[ "zeilenanfangDigit" ] = [];
    legende[ "zeilenanfangDigit" ] = ["|5", "Zeilenanfang mit Numerierung."];
    out = applyklammregexp( "zeilenanfangDigit", zeilenanfangDigit, out, index, legende );
    /* 
        ||
        Def: Spaltenumbruch; Abtrennung von Spalten; Spaltenanfang
    */ 
    index[ "spaltenanfang" ] = [];
    legende[ "spaltenanfang" ] = ["||", "Spaltenumbruch; Abtrennung von Spalten; Spaltenanfang."];
    out = applyklammregexp( "spaltenanfang", spaltenanfang, out, index, legende ); 
    
    return [out, index, legende];
}

function delKLAMMSYS( stringtomani ){ //RUN ON NFC/NFKC
    let matches = stringtomani.match( lueckeBestimmt );
    
    let i = 0;
    let out = "";
    let startindex = 0;
    while( lueckeBestimmt.exec( stringtomani ) ){
        console.log( lueckeBestimmt.lastIndex-matches[i].length, lueckeBestimmt.lastIndex, matches[i] );
        out += stringtomani.slice(startindex, lueckeBestimmt.lastIndex - matches[i].length); 
        i+=1;
        startindex = lueckeBestimmt.lastIndex;
    }
    return out;
}

//******************************************************************************
// USAGE
//******************************************************************************
function mach(){
    demUsage( document.getElementById( "inp").value ); 
}

function demUsage( atesttext ){
    //small greek/latin example
    if( atesttext === undefined ){
    atesttext = "„[IX]” ⁙ ἀλλ’ ἑτέραν τινὰ φύσιν ἄπειρον', ἐξ ἧς ἅπαντας γίνεσθαι τοὺς οὐρανοὺς καὶ τοὺς ἐν αὐτοῖς κόσμους· ἐξ ὧν δὲ ἡ γένεσίς ἐστι τοῖς οὖσι, καὶ τὴν φθορὰν εἰς ταῦτα γίνεσθαι κατὰ τὸ χρεών. διδόναι γὰρ αὐτὰ δίκην καὶ τίσιν ἀλλήλοις τῆς ἀδικίας κατὰ τὴν τοῦ χρόνου τάξιν, ποιητικωτέροις οὕτως ὀνόμασιν αὐτὰ λέγων· δῆλον δὲ ὅτι τὴν εἰς ἄλληλα μεταβολὴν τῶν τεττάρων στοιχείων οὗτος θεασάμενος οὐκ ἠξίωσεν ἕν τι τούτων ὑποκείμενον ποιῆσαι, ἀλλά τι ἄλλο παρὰ ταῦτα. οὗτος δὲ οὐκ ἀλλοιουμένου τοῦ στοιχείου τὴν γένεσιν ποιεῖ, ἀλλ’ ἀποκρινομένων τῶν ἐναντίων διὰ τῆς ἀιδίου κινή- σεως· 1 Summá pecúniae, quam dedit in [bla bla bla] aerarium vel plebei Romanae vel dimissis militibus=> denarium sexiens milliens. 2 Opera fecit nova § aedem Martis, Iovis Tonantis et Feretri, Apollinis, díví Iúli, § Quirini, § Minervae, Iunonis Reginae, Iovis Libertatis, Larum, deum Penátium, § Iuventatis, Matris deum, Lupercal, pulvinar ad [11] circum, § cúriam cum chalcidico, forum Augustum, basilicam 35 Iuliam, theatrum Marcelli, § porticus . . . . . . . . . . , nemus trans Tiberím Caesarum. § 3 Refécit Capitolium sacrasque aedes numero octoginta duas, theatrum Pompeí, aquarum rivos, viam Flaminiam.  Ϗ ϗ ϚϛȢȣꙊꙋἀἁἂἃἄἅἆἇἈἉἊἋἌἍἎἏἐἑἒἓἔἕἘἙἚἛἜἝἠἡἢἣἤἥἦἧἨἩἪἫἬἭἮἯἰἱἲἳἴἵἶἷἸἹἺἻἼἽἾἿὀὁὂὃὄὅὈὉὊὋὌὍὐὑὒὓὔὕὖὗὙὛὝὟὠὡὢὣὤὥὦὧὨὩὪὫὬὭὮὯὰάὲέὴήὶίὸόὺύὼώ	ᾀᾁᾂᾃᾄᾅᾆᾇᾈᾉᾊᾋᾌᾍᾎᾏᾐᾑᾒᾓᾔᾕᾖᾗᾘᾙᾚᾛᾜᾝᾞᾟᾠᾡᾢᾣᾤᾥᾦᾧᾨᾩᾪᾫᾬᾭᾮᾯᾰᾱᾲᾳᾴᾶᾷᾸᾹᾺΆᾼ᾽ι᾿῀῁ῂῃῄῆῇῈΈῊΉῌ῍῎῏ῐῑῒΐῖῗῘῙῚΊ῝῞῟ῠῡῢΰῤῥῦῧῨῩῪΎῬ῭΅`ῲῳῴῶῷῸΌῺΏῼ´῾ͰͱͲͳʹ͵Ͷͷͺͻͼͽ;Ϳ΄΅Ά·ΈΉΊΌΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώϏϐϑϒϓϔϕϖϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϰϱϲϳϴϵ϶ϷϸϹϺϻϼϽϾϿ Αι αι γγ γκ γξ γχ ου Υι υι ἄϋλος αὐλός  τί φῄς; γραφὴν σέ τις, ὡς ἔοικε, γέγραπται οὐ γὰρ ἐκεῖνό γε καταγνώσομαι, ὡς σὺ ἕτερον. δ̣[ὲ κ]αὶ";
    }
    let atttext = "";

    //latin
    doUVlatin = true; 
    let str1 = "<b>Textinput 1:</b>";
    atttext = atttext + "<br/>"+ str1+"<br/>"+ atesttext;
    //normed in analysis form
    let testnorm = normatext( atesttext, analysisNormalform );
    
    let disa = disambiguDIAkritika( testnorm ); 
    let disades = "<b>a) Disambuguation of diacritics (takes a string, replaces diakritica to have them equaly encoded, return string):</b>";
    atttext = atttext + "<br/><br/>"+ disades+"<br/>"+ disa;

    let ex = ExtractDiafromBuchstText( testnorm );
    let exdes = "<b>b) Separation of diakritics  (takes array of letters and returns array of array of diakritica and array of letters):</b>";
    //console.log(exdes);
    //console.log(ex);
    atttext = atttext + "<br/><br/>"+ exdes+"<br/>"+ ex ;

    let basicres =  basClean( atesttext );   
    let str2 = "<b>c) Text output basic norm (basic equalization and hypenation reversal):</b>";
    atttext = atttext + "<br/><br/>"+ str2+"<br/>"+ basicres;

    let translitbsp = TraslitAncientGreekLatin( basicres );
    let str12 = "<b>d) Text transliteration (takes greek utf8 string and returns transliterated latin utf8 string):</b>";
    //console.log( translitbsp );
    //console.log( str12 );   
    atttext = atttext + "<br/><br/>"+ str12+"<br/>"+ translitbsp; 

    let expeli = ExpandelisionText( testnorm );
    let desexpeli = "<b>e) Elusion expansion (given a text, if this is an elusion it will be expanded):</b>";
    //console.log( desexpeli );
    //console.log( expeli );
    atttext = atttext + "<br/><br/>"+ desexpeli+"<br/>"+ expeli; 

    let spiekla = spitzeklammernHTML( testnorm );
    let desspiekla = "<b>f) Spitze Klammern zu html (escapes spitze klammern to html encoding):</b>";
    //console.log( desspiekla );
    //console.log( spiekla );   
    atttext = atttext + "<br/><br/>"+ desspiekla+"<br/>"+ spiekla;

    let al = AlphaPrivativumCopulativumText( atesttext ); //Normal form composed!!!
    let desal = "<b>g) Alpha privativum  / copulativum (takes utf8 greek and splits the alpha privativum and copulativum from wordforms):</b>";
    //console.log( desal );
    //console.log( al );   
    atttext = atttext + "<br/><br/>"+ desal+"<br/>"+ al;

    let jo = iotasubiotoad( testnorm ); //Normal form composed!!!
    let desjo = "<b>h) JOTA (takes greek utf8 string and repleces jota subscriptum with jota ad scriptum):</b>";
    //console.log( desjo );
    //console.log( jo );   
    atttext = atttext + "<br/><br/>"+ desjo+"<br/>"+ jo;

    let diakdelled = deldiak( basicres );
    let str3 = "<b>i) Text output without diacritics (replaces diacritics):</b>" ;
    //console.log( str3 );
    //console.log( diakdelled );
    atttext = atttext + "<br/><br/>"+ str3+"<br/>"+ diakdelled;

    let numb = delnumbering( testnorm );
    let desnumb = "<b>j) Text output without numbering (takes string return string without the edition numbering i.e. [2]):</b>" ;
    console.log( desnumb );
    console.log( numb );
    atttext = atttext + "<br/><br/>"+ desnumb +"<br/>"+ numb;
    
    let unk = delunknown( testnorm );
    let desunk = "<b>k) Text output without some signs (delete some to the programmer unknown signs: †, *,⋖,#):</b>" ;
    //console.log( desunk );
    //console.log( unk );
    atttext = atttext + "<br/><br/>"+ desunk +"<br/>"+ unk;

    let mark = delmakup( testnorm );
    let desmark = "<b>l) Text output without markup (input a string and get it pack with markup removed):</b>" ;
    //console.log( desmark );
    //console.log( mark );
    atttext = atttext + "<br/><br/>"+ desmark +"<br/>"+ mark;

    let interpdelled = delinterp( basicres );
    let str4 = "<b>m) Text output without punctuation (takes string and returns the string without):</b>";
    //console.log( str4 );
    //console.log( interpdelled );
    atttext = atttext + "<br/><br/>"+ str4+"<br/>"+ interpdelled;

    let ligdelled = delligaturen( basicres );
    let str5 = "<b>n) Text output without ligature (takes a string return string with ligatures turned to single letters):</b>";
    //console.log( str5 );
    //console.log( ligdelled );
    atttext = atttext + "<br/><br/>"+ str5+"<br/>"+ ligdelled;

    let umbrdelled = delumbrbine( basicres );
    let str6 = "<b>o) Text output without newline (input string and get it back with linebreaks removed):</b>";
    //console.log( str6 );
    //console.log( umbrdelled );
    atttext = atttext + "<br/><br/>"+ str6+"<br/>"+ umbrdelled;

    let grkldelled = delgrkl( basicres );
    let str7 = "<b>p) Text output equal case (input a string and get it bach with all small case letters):</b>";
    //console.log( str7 );
    //console.log( grkldelled );
    atttext = atttext + "<br/><br/>"+ str7+"<br/>"+ grkldelled;

    let sidelled = sigmaistgleich( basicres );
    let str8 = "<b>q) Text output tailing sigma uniform (equalize tailing sigma):</b>";
    //console.log( str8 );
    //console.log( sidelled );
    atttext = atttext + "<br/><br/>"+ str8+"<br/>"+ sidelled;

    let kladelled = delklammern( basicres );
    let str9 = "<b>r) Text output no brackets (input stringa nd get it back with no brackets):</b>";
    //console.log( str9 );
    //console.log( kladelled );
    atttext = atttext + "<br/><br/>"+ str9+"<br/>"+ kladelled;

    let uvdelled = deluv( basicres );
    let str10 = "<b>s) Text output latin u-v (repaces all u with v):</b>";
    //console.log( str10 );
    //console.log( uvdelled );
    atttext = atttext + "<br/><br/>"+ str10+"<br/>"+ uvdelled;

    let alldelled = delall( basicres );
    let str11 = "<b>t) Text output all deleted (deletes UV, klammern, sigma, grkl, umbrüche, ligaturen, interpunktion, edition numbering, unknown signs, diakritika):</b>";
    //console.log( alldelled );
    //console.log( str11 );
       
    atttext = atttext + "<br/><br/>"+ str11+"<br/>"+ alldelled;

    let tre = Trennstricheraus( testnorm.split( " " ) );
    let destre = "<b>u) Text output no hypens (input array of words removes hyphenation):</b>";
    //console.log( destre ); 
    //console.log( tre );
    atttext = atttext + "<br/><br/>"+ destre+"<br/>"+ tre;


    let comb = GRvorbereitungT( atesttext );
    let descomb = "<b>v) Text output a combination of steps (diacritics disambiguation, normalization, hyphenation removal, linebreak to space, punctuation separation and bracket removal):</b>";
    //console.log( descomb );
    //console.log( comb );       
    atttext = atttext + "<br/><br/>"+ descomb+"<br/>"+ comb;
   
    
    //let klammsys = delKLAMMSYS( testnorm );
    let klammsys = hervKLAMMSYS( atesttext );
    let desklammsys = "<b>w) Editions Klammerung (delet leidener Klammersystem):</b>";
    //console.log( desklammsys );
    //console.log( klammsys );   
    atttext = atttext + "<br/><br/>"+ desklammsys+"<br/>"+ klammsys;

   document.getElementById( "erg").innerHTML = atttext;
}

function testprivatalpha(){
    //drittes Beispiel müsste raus genommen werden
    let bsp = ["ἀλλ’", "ἀϊδής", "ἀΐδιος", "ἀΐω", "ἀΐσθω", "ἀΐλιος", "Ἅιδης", "ἀϊών", "αἰών", "ἀΐσσω", "ἀΐδηλος", "ἀΐζηλος", "ἀΐσδηλος", "ἄϊδρις", "ἀϊστόω", "ἀΐσυλος", "αἴσῠλος", "ἄϋλος", "αὐλός", "ἀϊών", "αἰών", ];
    let Strout = "";
    for( let b in bsp ){
        Strout += "Eingabe "+ bsp[b]+ " Ausgabe "+ AlphaPrivativumCopulativum( bsp[b] ) +"<br>";

    }
     document.getElementById( "mata").innerHTML = Strout; 
}

//******************************************************************************
// FKT
//******************************************************************************
/*
All Fkt in this Script with short introduction

setAnaFormTO( formstring ) //setter for global variable of analysis normal form

setDisplFormTO( formstring ) //setter for the global variable of display normal form

disambiguDIAkritika( string ) // return String replaced of diakrit

normarrayk( array ) // normalizes the key strings of a dictiopnary 

normatextwordbyword( text, wichnorm ) //splits the text into words and calls norm fkt

normatext( text, wichnorm ) //calles norm fkt on whole string

disambiguDIAkritika( astr ) // takes a string, replaces diakritica to have them equaly encoded, return string

ExtractDiafromBuchst( buchst ) // takes array of letters and returns array of array of diakritica and array of letters

replaceBehauchung( adiakstring ) // replaces behauchung in the transliteration of greek to latin

Expandelision( aword ) // given a word, if this is an elusion it will be expanded

TraslitAncientGreekLatin( astring ) // takes greek utf8 string and returns transliterated latin utf8 string

spitzeklammernHTML // ascapes spitze klammern to html encoding

basClean( astring ) // basic equalisation and hypenation reversal

AlphaPrivativumCopulativum( aword ) // takes a word utf8 greek and splits the alpha privativum and copulativum from wordform

iotasubiotoad( aword ) // takes greek utf8 string and repleces jota subscriptum with jota ad scriptum

ohnediakritW( aword ) // replaces diakritica

capitali( astring ) // first letter capitalized rest lowercase

nodiakinword( astring ) // combination of diakrica removal and jota subscriptum conversion

delall( text ) //deletes UV, klammern, sigma, grkl, umbrüche, ligaturen, interpunktion, edition numbering, unknown signs, diakritika

delnumbering( text ) //takes string return string without the edition numbering i.e. [2]

delligaturen( text ) // takes a string return string with ligatures turned to single letters

deldiak( text ) //like nodiakinword()

delinterp( text ) //takes string and returns the string without

delunknown( text ) // delete some to the programmer unknown signs

delumbrbine( text ) // input string and get it back with linebreaks removed

delmakup( text ) //input a string and get it pack with markup removed

delgrkl( text ) //input a string and get it bach with all small case letters

sigmaistgleich( text ) //equalize tailing sigma

delklammern( text ) // input stringa nd get it back with no brackets

deluv( text ) // repaces all u with v

Trennstricheraus( array of words ) //input array of words removes hyphenation

UmbruchzuLeerzeichen( text ) // input a string and get back a string with newlines replaces by spaces

Interpunktiongetrennt( wordlist ) //input array of words and have the interpunction separated from each word

Klammernbehandeln( wordlist ) // same as delklammern but on array of words

iotasubiotoadL( wordlist ) // same as iotasubiotoad but on array of words

GRvorbereitungT( text ) // input a string and get a combination of diakritica disambiguation, normalization, hyphenation removal, linebreak to space, interpunktion separation and klammern removal

hervKLAMMSYS( text ) // input a string, mark all editorial signs
*/
//eof
