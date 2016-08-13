var doc, testContainer, jsdom, Ev;
const linkifyElement = require(`${__base}linkify-element`).default;
const htmlOptions = require('./html/options');

try {
	doc = document;
} catch (e) {
	doc = null;
}

jsdom = doc ? null : require('jsdom');

describe('linkify-element', () => {

	/**
		Set up the JavaScript document and the element for it
		This code allows testing on Node.js and on Browser environments
	*/
	before(function (done) {

		function onDoc(doc) {
			testContainer = doc.createElement('div');
			testContainer.id = 'linkify-element-test-container';

			doc.body.appendChild(testContainer);
			done();
		}

		if (doc) {
			Ev = window.Event;
			return onDoc(doc);
		}

		jsdom.env(
			'<html><head><title>Linkify Test</title></head><body></body></html>',
			function (errors, window) {
				if (errors) { throw errors; }
				doc = window.document;
				Ev = window.Event;
				return onDoc(window.document);
			}
		);
	});

	beforeEach(() => {
		// Make sure we start out with a fresh DOM every time
		testContainer.innerHTML = htmlOptions.original;
	});

	it('Has a helper function', () => {
		expect(linkifyElement.helper).to.be.a('function');
	});

	it('Works with default options', () => {
		var result = linkifyElement(testContainer, null, doc);
		expect(result).to.equal(testContainer); // should return the same element
		expect(testContainer.innerHTML).to.be.oneOf(htmlOptions.linkified);
	});

	it('Works with overriden options (general)', () => {
		var result = linkifyElement(testContainer, htmlOptions.altOptions, doc);
		expect(result).to.equal(testContainer); // should return the same element
		expect(testContainer.innerHTML).to.be.oneOf(htmlOptions.linkifiedAlt);
	});

	it('Works with overriden options (validate)', () => {
		var result = linkifyElement(testContainer, htmlOptions.validateOptions, doc);
		expect(result).to.equal(testContainer); // should return the same element
		expect(testContainer.innerHTML).to.be.oneOf(htmlOptions.linkifiedValidate);
	});

	it('Works when there is an empty text nodes', () => {
		testContainer.appendChild(doc.createTextNode(''));
		var result = linkifyElement(testContainer, null, doc);
		expect(result).to.equal(testContainer); // should return the same element
		expect(testContainer.innerHTML).to.be.oneOf(htmlOptions.linkified);
	});
});
