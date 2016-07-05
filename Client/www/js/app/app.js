/*
*	muskat client v0.0.1
*	Josef Schulz, 13.6.2016
*/

$(document).ready(function() {
	var debug_console = document.getElementById("textarea_debug");

	function debug(message) {
		debug_console.value += message + "\n";
		debug_console.scrollTop = debug_console.scrollHeight;
	}

	debug("muskat client v0.0.1")

	/*
	*	toggle visibility of the debug console
	*/

	$('#button_toggle_debug').click(function toggleDebug() {
		debug_console.style.visibility = (debug_console.style.visibility == "visible" || debug_console.style.visibility == "") ? "hidden" : "visible";
	});

	/*
	*	WebSocket global variables	
	*/

	var wsUri 		= "ws://localhost:1234";
	var websocket 	= null;
	var idCnt		= 0;

/*	var imgData = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAHgAoADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCOgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBQCelAClSBn8x6UANoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAHhPX/P1/+t+lAEgAHSgBCe1K4ERGDimAlABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQA4L68fz/APrf54ouBIB+ApbgOpgNJpXASkIa3r6f5/z9aaGMpgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQA4Ke/H8/y/wAcUXAeAB0/+vSuIcBRYYtMBpOaQhKQBQAUwIjxTGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAOCk+w/wA/59PegBwAH+P+en8/elcBetAhwGKYwJxQA2kIKQBQACmAtADG7H8P8P8AP0poYygAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBQCf8aAHgAe/wBf8P8A9dK4C0hCgUwHUxiE0rgNpCCgAoAKADvTAX/P+fwoGIfSgRFTGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACgE9KAHAAdeT+n+fr+VFwFJPpikIBmgBwHrRYY6mA0mkAlIQUAFABQAUAFABTAKQDGHf8Az/n/AAqkMbQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAKBnpQA4L+PsP6n/P1oAfj1/If5/wAKAF4HtQAz7xz+VIQ8DFAxaYDSaQhKQBQAUAFABQAUAFABQAUAIRkUwI6YwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgB4X1/If49BQA/AA54Hp/nk0AOHtQAhOKAG4JPP8A+qkIeBimMTNADaQgpAFACZpgGaLAJmiwC5osAuaACkAUAFABQAxh39f5/wCf61SGNoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAcFPf8u//ANb+npQBIFA68f57n/DvQA3d2Uf5+n9TQA4L3Jyf0oACfTk/y+tAABnk0hDqYxCaQDaQgoAKAGk0wEpgFABQAYNABQAuaQDs5oAKQBQAhGRTQEdMYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAOCk+1ADwv4fz/8Arf5zQAFgvA5P+etACbWbluPagB4AA9KAEJz0/wA/SlcQAUDHUwEJpXAbSEFABQAzOaYBTAeF9aAsOwB2oGLQAUAJgelADSvpQKwygBwNIBaQBQAxhzn1/n3qkMbQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAKATQBIF9PzP9P8/jQA7GKAGncenA9T1/Adf89qAFCgfX1oAUnH19KAG8nr+XakIcBimMWgBpNIBKQgoAKAGk0wE60wJQMfWgYtABQAUAFABQAUAIQDQBGVI+lAgBpAOpAIRkU0BHTGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQA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MCVTkUxi0AFABQAUAFABQAUAFABQAUAFABQAUANZc/WgCLac4xQBMowP50ALQBG33vyoELUgFABQAhGR+tNDI6YBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAKCQcigCXqMj8aTASkIKACgAoAKAGHrTAeo70wQ+gYUAFABQAUAFABQAUAFABQAUAFABQA0qD7UAMIIoEANIB1IAoAKACgApgPpjCgBpFJgJSEFADTTAcp7UwQ+gYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUARt978qBC1IBQAUAL0BNNDIaYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADlOD7d6AJD+lIQlIAoAKACgBlMCVegpjFoAKACgAoAKACgAoAKACgAoAKACgAzQAUAHWgCMr6UCG0gHA5oAWkAUAFACg00MdTAKAGVIgoAQ0wGjg0wJqBhQAUAFABQAUAFABQBCzE9OlACAkdDQBKrZ+tADqACgAoAKACgAoAjb735UCFqQCgAoARz0H41QyOgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAerY4PT+VADqQgpAFABQAymBKOg+gpjFoAKACgAoAKACgAoAKACgAoAKAImbJx2oAZQAoJHQ0ASB/WgB9ADSufrQBH0oEOBpALSAKACgBwqhi0AIRSYDaQgoAZTAkU8fSmNDqACgAoAKACgAoAaxwpoAhoAKAFBwc0AT0AFABQAUAFABQBEfvfjSEOpAFACj1poZETkk0wEoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCRTkYPXt70ALUiCgAoAaetMCQdB9KYxaACgAoAKACgBrHAoAZvPtQAof1FAEgOelABQAUAVz1NABQAUAFADlbH0oAmoAQjNAEZGKBADSAdSAKAFFMB1MYUANNIQlIBDTAQHBpgS0DCgAoAKACgAoAY/QfWgCKgAoAKAJkOV+nFADqACgAoAKACgCIdaQh1IAoAHOBj1qhkVABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBKDuGe/ekwCkIKAGmmgHr0+lMYpOOTQAzzPb9aAHBwfb60AOoAKAI36igCOgAoAUEjpQBKGBoAdQBC4wfrQA2gAoAKACgCRG7flQBJQAhGaAIyMUCAGkA6kAUAOBpoYtMBDQA2pEFADKYEinIpjHUAFABQAUAFADH6fjQBFQAUAFAEkfQ0ASUAFABQAUAIehoAjFIQ6kAopoZGxyT+QpgNoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAFBwc0AS9RkdDSYCUhCHpTAFPOPWmCHP8Ad/KgZDQAUAODEe4oAmBz0oAa4yPpQBDQAUAFACg4OaAJgcjNAARkYoAg6cUAFABQAUAFAE4OQDQAtAARmgCIjFAgBpAOpAFADxVDCgBpFJgJSEIaYCA4NMCWgYUAFABQAUAIwyDQBBQAUAFAEkff8KAJKACgAoAKAGt0oExopMBaQCk4X3NUhkNABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADlbB9j1oAkNIQlIBvQ/jTAk6j60xkJGDigBKACgBytg+1AE1AELLjp0oAbQAUAFAD0ODj1oAloAay5+vrQBERjrQAlABQAUATL90UAOoAKAEIzQBGRigQoNIBaQCimA6mMKAGVIgoAZTAep7flTBD6BhQAUAFABQBCwwfbtQA2gAoAlQYH1oAfQAUAFABQBGx5+lAmA6UgHCgBjnJx6fzpjGUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAD1P8J/CgB1SIQ0wHKeMelMEDLn60DIaACgAoAlQ5H0/lQA/rwaAIWUj3FADaACgBV6j60AT0AFACEA9aAGFPQ/gaAG7W9KAFCHvxQBLQAUAFABQAhGaAIulAhwNIBaQDgaaGLTAQikwG0hCEUwG0wJQc/WgYtABQAUAFACMMigCEqRQAqqT9KAJqACgAoAKAEJwKAIuppCH0gF6DNNDIaYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAEqncMdx+tDAKkQ0cGmBLTGNZc/WgCIgjrQAlAD06n6UAS0AFADSoPsaAGbD6igByrjnvQA+gAoAKACgAoAKACgAoAKACgAoAawz9aAI6Qh9IAoAfVDCgBpFIQlIBpFMABxTAkBzQMWgAoAKACgAoAKACgAoAKACgBjHtQJjRSAdQAjnoPxpjI6ACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKADpyKAJchhkfiKTAQigQqntTBD6BhQA3YvpQAoAHSgBaACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCNh3oEIDSAdSAUGmhjqYAaAGVIgoAaRimAA4pgSA5oGLQAUAFABQAUAFABQAUAITj60ARUCH1ICj1poZETkk0wEoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAFBIP8xQBL7jpSYDOhyKBEgORmmMWgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAOtAERGDigQoNIBaQDgaoYtACEUmA2kIKAGkYpgIDimBIGz9aBjqACgAoAKACgAoAQnFAEROaBDgO9IBaQA5wMetUMioAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAerY4PQ/pQA4ikIQHaaYElAwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAGsOM0CZHSAfSAKYD6YwoAYaQgpAFADSKYCUwHBiPegBwYUDFyKAFoATIHegBpb0/OgVxlACgUgHUgFFNDI2OSfyFMBtABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQBIpz8p/D/CgBSKQgU44P4UwH0DCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAiIwaBCikAtIBQaaGOpgIRQA2pEFABQAhFMBtABTAKACgAoAKAFApAOpAFACk4X9PxqhkNABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAEoO4e460MBCKQhVbsetMB9AwoAKAE3D1FAC0AFABQAdKAI9/t+tADg4Pt9aAHUAFABQA1jgUAR729f0FABub1oAeHHfigB9ABQAUAMYd6BMYKQD6QBQA4VQxaAGkUmAlIQUAFABQAmKYCYouAYouAuKLgLigApAFACimgGOcnHpTGMoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAUHBzQBL1GR+NJgNIoEOVs8HrTGOoAY/QUARUAKCR0/wDrUASqwPsf50AOoAY/T8aAIqACgBQxH+FAEwYH/CgBaAGP0H1oAioAKACgBwYj6elAEoIPIoAWgBDyKAIqBDh0pALSAUUwHUxhQAypEFABQAUAFABQAUAFABQAUAFAC9BmqQyGgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAHKcH270ASfyNIQ0igByt2NMBSMjFAyCgAoAKAJVbPB6/zoAcRkYoAgIxwaACgAoAAccigCdTkfzoACMjH+c0AQdKACgAoAKAFBwc0AT9eRQAUARHqaBAKTAdSAKAHA00MWmAhFJgNpCCgAoAKACgAoAKACgAoABTARz0H40xkdABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFAD1bsenb2oAdSEIRQAobsf8/WmAMueR1/nQMioAKACgCcHIBoAay55HX+dAEVABQAUAOU4P1oAmoAYy55HX+dAEVABQAUAFAEiHqKAJKAI260CEHWkA6kAUAFAD6oYUANIxSEJSAKACgAoAKACgAoAKAHD1poZCTkk0wEoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAJFOeD17e9AC1IhCM0wAEjr0/z0pgKVDcjr/nrQMjKkdR+NACUATJ0oAdQA0qD9fWgCIqR/jQAlACgZIFAE9ABQA0qD7GgCMqR/jQA2gAoAeg5zQBLQBG/X8KBMQdaQDqQBQAUAKKaGOpgIRmgBtSIKACgAoAKACgAoAKABzgY9f5VQyKgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCUHcM9+9JgFIQUAJyOlMB4YH60xhgeg/KgBaACgAoAKAG7VPagBQAOgoAWgAoAKACgBCoPagBuwe9ADwAOlABQBG3WgQg60gHUgCgAoAKAHCmhi0wGkUmAlIQUAFABQAUAFACimhkbHJP5UwG0AFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAKDg5oAk4PIpMApCCgBCKYAGI6/wD16YDwc9KBi0AFABQAUAFABQAUAFABQAUAFABQAUAQ0CFFJgOpAFABQAUAFMB9MYUAMpCCkAUAFABQAUAKThf0qhkNABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAOVsH2PWgB9IQUgCgAoAbgjpTAcG9fzphcf1oGFABQAUAFABQAUAFABQAUAFADGPagQygBwpALSAKACgAoAKAFBpoY6mAhFJgNpCCgAoAKAFFNDGOcnHpTAZQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQA9T/CfwoAdUiCgAoAKAExTATBHSgBQx780wuODD6UDHUAFABQAUAFABQAUAMLelArjKAFApAOpAFABQAUAFABQAUAOFUMWgBpFIQlIAoAKAHdBmqQyCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAJVO4Y7j9aGAVIgoAKACgAoAMUwG4ouAcigBdxpgLvPpQFw3+1AXDf7UBcTcaAuNznrQAUAKB60gHUgCgAoAKACmAYPvQAc/5FABSAUUwHUxhQAypEFACimA1z0H40xkdABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAHTkUATD5hnv3pWAMUWAMGiwhMGgApAFABQAUAFACYFMAxRcAxRcAxRcAwKAFpAFABQAUAFABQAUAL/AJ4pgH4/nQMOKBCUgHA00MWmAhHekwG0hDhTQyEnJJpgJQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUALk+p/M0ALvb1/QUALvPt/n8aAF8z2/WgBd47j+v+FABuX6fh/hQAuV9f5j+dFgDj1/UUrALiiwCYosAYNFgDBosITFABSAKACgAoAKACgAoAKAFpgFACUgCgB9UMKAG45pCEc4GPX/JpjIqACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAXJ9T+ZoAXc3r/ACoAXefagBd/qP8AP60ALvHcf1/woAN6n/64/wD10ALuU9x/KgA+X1H50WAXFKwBiiwCYosAYNFgDBosITFABSAKAFBpgOpjCgCFjk/pQA2gAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAFyfU/nQAu5vWgBd59j/n2oAXee4/p/jQAb/Uf5/SgBd496AF3L6/pQAZX1H50AOoARjgfyoAgoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAM9u1ABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQB//2Q==";
	document.getElementById('img').setAttribute( 'src', 'data:image/jpeg;base64, '+imgData); * /
	/*
	*	change visibility of windows
	*/

	$('#button_connect_to_server').click(function connectToServer() {
		wsUri = $('#text_server_uri').val();	

		document.getElementById("window_config").style.display = "none";
		document.getElementById("window_render").style.display = "block";

		debug("connecting to " + wsUri);

		startWs();
	});

	/*
	*	Check if webgl is available and global variables
	*/

	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var display;
	var stats;
	var camera, scene, renderer;
	var uniforms;
	var texture_rgb;
	var texture;
	var mesh;


	/*
	* WsFunctions
	*/

	function startWs() {
		try {
			if (typeof MozWebSocket == 'function')
				WebSocket = MozWebSocket;
			if ( websocket && websocket.readyState == 1 )
				websocket.close();

			websocket = new WebSocket( wsUri );
			websocket.onopen = function (evt) {
				debug("connected to " + wsUri);
				
				initGl();
				animateGl();
			};

			websocket.onmessage = function (evt) {
				//debug("Message received: "+ evt.data );
				var obj = JSON.parse(evt.data);

				if(obj.result.rgb != "") {
					//obj.result.rgb = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAHgAoADAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCSgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBCaVwFpgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAmaADr9KQC0wGk0rgJSEOFNDFpgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAmaAEzSAUCiwC0wGk5pCEpAFABTAfTGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADc0rgJ1oEOAxTGBOKAG0hBSAKAAUwFoAUUIYtMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAbmlcBKQhQKYDqYxCaVwG0hBQAUAFAB3pgL/n/P4UDE6UCH0xhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUANLUgGkn/8AXQIBmgBwHrRYY6mA0mkAlIQUAFABQAUAFABTAKQDhTQxaYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAJn05oATBPU/l/n/CgBeB7UAM+8c/lSEPAxQMWmA0mkISkAUAFABQAUAFABQAUAFACimA6mMKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoATPpzQAh9WP+f8AP+TQA4e1ACE4oAbgk8//AKqQh4GKYxM0ANpCCkAUAJmmAZosAmaLALmiwC5oAKQBQAUAFADh0qkMWgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBM0AH14H+epoAZu7KP8/T+poAcF7k5P6UABPpyf5fWgAAzyaQh1MYhNIBtIQUAFADSaYCUwCgAoAMGgAoAXNIB2c0AFIAoAUUwHUxhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAmaADk+386AGlgvA5P8AnrQAm1m5bj2oAeAAPSgBCc9P8/SlcQAUDHUwEJpXAbSEFABQAzOaYBTAeF9aAsOwB2oGLQAUAJgelADSvpQKwygBwNIBaQBQA4VQxaACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoATk9OPf/P+fegAxigBp3HpwPU9fwHX/PagBQoH19aAFJx9fSgBvJ6/l2pCHAYpjFoAaTSASkIKACgBpNMBOtMCUDH1oGLQAUAFABQAUAFACEA0ARlSPpQIAaQDqQCimhjqYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADc+lIBcevNMBaACgAoAaT6fn/hSuAgFG4h9MYUANzSEJSAKACgBDTAbTAkUYFAx1ABQAUAFABQAUAFABQAUARlcdOn8qBADSAWkA4VQxaACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAEJpXATGev+f8/5xQAFgv8AgKYANx5PA9O5+tADqAEJx9fSgBvXr+VK4hQKLDHUwEJoAbUiCgAoAKACgBppgKoyaYElAwoAKACgAoAKACgAoAKACgAoAjYY+lAgBzSAcKEMdTAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBvJ+lLcBeBzTAZuLcLx7/wCelADgoHJ5NADqAGk56fn/AIUriEoAcBRYYtMBCaVwG0hBQAUAFABQAh6UwG0wJQMCgYtABQAUAFABQAUAFAELMSfSgADEe/1oAlBB5FAC0AHWgCLoaQh1IB4qhhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACZ/GgAx60AIWxwOTQA3aScsfw/z0/z3oAeAB0oACfxNADevWkIOtADgMUxi0ANJpAJSEFABQAUAFABQA000AAZIpgS0DCgAoAKACgAoAKAGt900AQ0AFAD0ODjsf50AS0AFACEZHvQBGPSkIeKEMdTAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAE6/SgBcYoAD+VACAAdBQAEgUANJJ9v50riDFACgUDHUwCgBpNIQlIAoAKACgAoAKACgBp60wHJ3NMEPoGFABQAUAFABQAUANb7poAhoAKACgCdTkA0ALQAUARsO/wDnNAmKDSAfTGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAmfzoAMdz/9agABB6fn2oAWgAoAaT6fn/hSuAlAhaAFAosMWmAhNADaQgpAFABQAUAFABQAUAFADKYEi9KYx1ABQAUAFABQAUAFAAeeKAK9ABQAUASp0P1oAfQAUAIRkYoAjHBxSEPFCGOpgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAJ16dPX/CgBpYL7n/AD1NACAFuW6en+f/ANdAElACE/iaAG9ev/1qVxBQA7FFhi0wCgAoAaaTASkIKACgAoAKACgAoAKACgBlUBKOgoGLQAUAFABQAUAFABQAUAROMHPrQAygAoAkj7/h/WgCSgAoAKAGMO9AmANIB9MYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAITigBD6t09P89fpQA3LN93gev/ANf+goAcFA9z60AKSBQA0kn2HpSuIMUAOxRYYtMAoAKACgAoAKAGVIgoAKACgAoAKACgAoAQ9KYDaYE1AwoAKACgAoAKACgAoAKAEIyMUAQkY4NACUASoMD60APoAKACgBCMjFAEY9KTESChDFpgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAmewoAQ8dBkn/P4D/PvQAm3PLfl2H+f85oAdwPagBMk+386VxCAUAOxRYYtMAoAKACgBM0XATNK4DqYBQAhFJgNpCCgAoAKACgAoAKAEPSmA0daYE1AwoAKAGs2PrQAzefagBysD14NAD6ACgAoAKAEIB60AN2CgB9ABQAUAFABQBG3B/WgQtIB9MYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAN5PsKQh3SmMCQOtADcntx9f8KVxAB/k9aAFxTGLQAUAFABQAmaVwG5oEFIAoAUGmhjqYBQA00hCUgCgAoAKACgAoAQ9KYCDqKYEtAwoAKAICcnNACUAFAEqNng9RQA+gAoAKACgAoAKACgAoAKACgBrDj6UAxo6UhDxQhi0wCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBCaQDR8x9qBDsgUxiZJ6cfzpXEAX1oAXFMYtABQAUAJmgBM0rgJSEFABQAUAFABQA4Gmhi0wENADakQUAFABQAUAFACHpTAQdRTAloGFACHoaAIKACgAoAUHBBoAnoAKACgBu4dM0AOoAKACgAoAKACgAoAiHXFJiHCgB9MYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQA0mlcBpzQIQA0APC0AOpjCgAoAKAEzSuAmaBCUgCgAoAKACgAoAKACgApgPpjCgBpFJgJSEFABQAUAFACHpTAbTAmoGFACHoaAIKACgAoAKAJkOVHtxQA6gCNz2/OgCOgBysR9KAJqACgAoAKACgAoAjPDfrQIWpAcKaGLTAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAQnFADaQgpAOxTsMWmAUAFABQA3NK4CUhBQAUAFABQAUAFABQAUAFABQAUAKDTQx1MAoAZUiCgAoAKACgAoAZVATUDCgAoAgIwSKAEoAKACgCVOh+tAD6AIW+8aAG0AFAEqHjHpQA+gAoATI9RQAtABQAx+xoEwqQFFMB1MYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADSaVwExQIdiiwxaYBQAUAJkUXATNK4CUhBQAUAFABQAUAFABQAUAFABQAUAFABQAUAOFUMWgBCKTAbSEFABQAUAFADKoCUdBQMWgAoAicd/WgBlABQAUASp0NAD6AIG+8aAEoAKAHKcMPyoAmoAY5wPr/KgCKgCRG7H8KAJKAGt0oAaOlIQtIBwpoYtMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAEJxQAnJpALiiwC0wCgAoATNK4CZoEJSAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAFFMB1MYUANIpCEpAFABQAUAMPWmBIvSmNDqACgBCMjFAEJGDigBKACgCdRgAUALQBE45+tADKACgAFAFigCJ+o+lADKACgCdTkA0AB6GgCMUmIdSAUdaYDqYwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAExQAtABQAZoAbmlcBKQgoAKACgBM0wEzQAZNABk0AGTQAZosAuaAFpAFABQAUAFABQAUAFABQAUAOBpoYtMANADKkQUAFABQA00wHJ3pgh9AwoAKAEIB60AM2ehoAcFA9zQA6gAoAY4yM+n8qAIqACgAoAsUARP1H0oAZQAUASIeo/GgCSgCIcGkIdSAKAHCqGLQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACZpXATJouISkAUAFABQAhOKYDaACmAoBNAC7TQFhdnvQFg2e9AWE2mgLCYPpQAlAC5pALmgBaQBQAUAFABQAUAFABQA+qGFADSKTASkIKACgBDTQAvWmBJQMKACgAoAKACgAoAKACgCFlwfagBtAD0GTn0oAloAY44z6GgCKgAoAenU/T/CgCWgCP+L8aQhaQBQAopoB1MYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAhNK4DaBBSAKACgAoAKACgBlMBQM0wJAAKBi0AFABQAUAFABQAmAaAGlfSgVhpBFACUgHZoAWkAUAFABQAUAFACg0wHUxhQAykIKQBQAh6UwGimBNQMKACgAoAKACgAoAKACgAoAbsWgBQMcCgBaAAjIxQBARg4oASgB6dT9KAJaAIz978qQhaQBQAUAOFUMWgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAEIpANpCCgAoAKACgAoAaaaAQDNMCUDFAxaACgAoAKACgAoAKACgAoAKAGlQaAGFSKBCZpAOBoAWkAUAFABQAUAOBpoYtMBCKAG1IgoAKAGUwJVORTGLQAUAFABQAUAFABQAUAFABQAUAFABQA1lz9aAItpzjFAEyjA/nQAtAEbfe/KgQtSAUAFACimhjqYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADSKTASkIKACgAoAKAGHrTAeo70wQ+gYUAFABQAUAFABQAUAFABQAUAFABQA0qD7UAMIIoEANIB1IAoAKACgApgPpjCgBpFJgJSEFADTTAcp7UwQ+gYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUARt978qBC1IBQAUAOFNDFpgFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADSMUhCUgCgAoAKAGUwJV6CmMWgAoAKACgAoAKACgAoAKACgAoAKADNABQAdaAIyvpQIbSAcDmgBaQBQAUAKDTQx1MAoAZUiCgBDTAaODTAmoGFABQAUAFABQAUAFAELMT06UAICR0NAEqtn60AOoAKACgAoAKACgCNvvflQIWpAKACgB9UMKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAZSEFIAoAKAGUwJR0H0FMYtABQAUAFABQAUAFABQAUAFABQBEzZOO1ADKAFBI6GgCQP60APoAaVz9aAI+lAhwNIBaQBQAUAOFUMWgBCKTAbSEFADKYEinj6UxodQAUAFABQAUAFADWOFNAENABQAoODmgCegAoAKACgAoAKAIj978aQh1IAoAUU0MdTAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAQjNADakQUAFADT1pgSDoPpTGLQAUAFABQAUANY4FADN59qAFD+ooAkBz0oAKACgCuepoAKACgAoAcrY+lAE1ACEZoAjIxQIAaQDqQBQAopgOpjCgBppCEpAIaYCA4NMCWgYUAFABQAUAFADH6D60ARUAFABQBMhyv04oAdQAUAFABQAUARDrSEOpAFAD6oYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACEUmA2kIKAGmmgHr0+lMYpOOTQAzzPb9aAHBwfb60AOoAKAI36igCOgAoAUEjpQBKGBoAdQBC4wfrQA2gAoAKACgCRG7flQBJQAhGaAIyMUCAGkA6kAUAOBpoYtMBDQA2pEFADKYEinIpjHUAFABQAUAFADH6fjQBFQAUAFAEkfQ0ASUAFABQAUAIehoAjFIQ6kAopoY6mAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQA0ikwEpCEPSmAKecetMEOf7v5UDIaACgBwYj3FAEwOelADXGR9KAIaACgAoAUHBzQBMDkZoACMjFAEHTigAoAKACgAoAnByAaAFoACM0AREYoEANIB1IAoAeKoYUANIpMBKQhDTAQHBpgS0DCgAoAKACgBGGQaAIKACgAoAkj7/AIUASUAFABQAUANbpQJjRSYC0gHCqGLQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUANIxSEJSAb0P40wJOo+tMZCRg4oASgAoAcrYPtQBNQBCy46dKAG0AFABQA9Dg49aAJaAGsufr60AREY60AJQAUAFAEy/dFADqACgBCM0ARkYoEKDSAWkAopgOpjCgBlSIKAGUwHqe35UwQ+gYUAFABQAUAQsMH27UANoAKAJUGB9aAH0AFABQAUARsefpQJgOlIBwoAdTGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAMqRCGmA5Txj0pggZc/WgZDQAUAFAEqHI+n8qAH9eDQBCyke4oAbQAUAKvUfWgCegAoAQgHrQAwp6H8DQA3a3pQAoQ9+KAJaACgAoAKAEIzQBF0oEOBpALSAcDTQxaYCEUmA2kIQimA2mBKDn60DFoAKACgAoARhkUAQlSKAFVSfpQBNQAUAFABQAhOBQBF1NIQ+kA4U0MWmAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAhGaAG1Iho4NMCWmMay5+tAERBHWgBKAHp1P0oAloAKAGlQfY0AM2H1FADlXHPegB9ABQAUAFABQAUAFABQAUAFABQA1hn60AR0hD6QBQA+qGFADSKQhKQDSKYADimBIDmgYtABQAUAFABQAUAFABQAUAFADGPagTGikA6gB9MYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACEUmAwigQqntTBD6BhQA3YvpQAoAHSgBaACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgCNh3oEIDSAdSAUGmhjqYAaAGVIgoAaRimAA4pgSA5oGLQAUAFABQAUAFABQAUAITj60ARUCH1IDhTQxaYBQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADSKQDOhyKBEgORmmMWgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAOtAERGDigQoNIBaQDgaoYtACEUmA2kIKAGkYpgIDimBIGz9aBjqACgAoAKACgAoAQnFAEROaBDgO9IBaQD6oYUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADCKQhAdppgSUDCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAaw4zQJkdIB9IApgPpjCgBhpCCkAUANIpgJTAcGI96AHBhQMXIoAWgBMgd6AGlvT86BXGUAKBSAdSAUU0MdTAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBDzQA0ikIFOOD+FMB9AwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAIiMGgQopALSAUGmhjqYCEUANqRBQAUAIRTAbQAUwCgAoAKACgBQKQDqQBQA8VQwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAQikAwigQqt2PWmA+gYUAFACbh6igBaACgAoAOlAEe/2/WgBwcH2+tADqACgAoAaxwKAI97ev6CgA3N60APDjvxQA+gAoAKAGMO9AmMFIB9IAoAcKoYtADSKTASkIKACgAoATFMBMUXAMUXAXFFwFxQAUgCgBRTQDqYwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKAGkUmA0igQ5WzwetMY6gBj9BQBFQAoJHT/61AEqsD7H+dADqAGP0/GgCKgAoAUMR/hQBMGB/woAWgBj9B9aAIqACgAoAcGI+npQBKCDyKAFoAQ8igCKgQ4dKQC0gFFMB1MYUAMqRBQAUAFABQAUAFABQAUAFABQA4VSGLQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQA0jFIQ0igByt2NMBSMjFAyCgAoAKAJVbPB6/wA6AHEZGKAICMcGgAoAKAAHHIoAnU5H86AAjIx/nNAEHSgAoAKACgBQcHNAE/XkUAFAER6mgQCkwHUgCgBwNNDFpgIRSYDaQgoAKACgAoAKACgAoAKAAUwH0xhQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAMpCEIoAUN2P+frTAGXPI6/zoGRUAFABQBODkA0ANZc8jr/ADoAioAKACgBynB+tAE1ADGXPI6/zoAioAKACgAoAkQ9RQBJQBG3WgQg60gHUgCgAoAfVDCgBpGKQhKQBQAUAFABQAUAFABQA4U0MWmAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACEZoAbUiEIzTAASOvT/PSmApUNyOv+etAyMqR1H40AJQBMnSgB1ADSoP19aAIipH+NACUAKBkgUAT0AFADSoPsaAIypH+NADaACgB6DnNAEtAEb9fwoExB1pAOpAFABQAopoY6mAhGaAG1IgoAKACgAoAKACgAoAfVDCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBCKTAbSEFACcjpTAeGB+tMYYHoPyoAWgAoAKACgBu1T2oAUADoKAFoAKACgAoAQqD2oAbsHvQA8ADpQAUARt1oEIOtIB1IAoAKACgBwpoYtMBpFJgJSEFABQAUAFABQAopoY6mAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADSKTASkIKAEIpgAYjr/8AXpgPBz0oGLQAUAFABQAUAFABQAUAFABQAUAFABQBDQIUUmA6kAUAFABQAUwH0xhQAykIKQBQAUAFABQA+qGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFADSMUhCUgCgAoAbgjpTAcG9fzphcf1oGFABQAUAFABQAUAFABQAUAFADGPagQygBwpALSAKACgAoAKAFBpoY6mAhFJgNpCCgAoAKAFFNDHUwCgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAZUiCgAoAKAExTATBHSgBQx780wuODD6UDHUAFABQAUAFABQAUAMLelArjKAFApAOpAFABQAUAFABQAUAOFUMWgBpFIQlIAoAKAHCqGLQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACEUANqRBQAUAFABQAYpgNxRcA5FAC7jTAXefSgLhv8AagLhv9qAuJuNAXG5z1oAKAFA9aQDqQBQAUAFABTAMH3oAOf8igApAKKYDqYwoAZUiCgBRTAdTGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFACEUrAJiiwBg0WEJg0AFIAoAKACgAoATApgGKLgGKLgGKLgGBQAtIAoAKACgAoAKACgBf88UwD8fzoGHFAhKQDgaaGLTAQjvSYDaQhwpoYtMAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAMCgBMCiwBgUrAGKLAJiiwBg0WAMGiwhMUAFIAoAKACgAoAKACgAoAWmAUAJSAKAH1QwoAbjmkIdTGFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAFABQAUAGBQAmBRYAxSsAYosAmKLAGDRYAwaLCExQAUgCgBQaYDqYwoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgBMCgBaACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgAoAKACgD/2Q==";
					//document.getElementById('img').setAttribute( 'src', 'data:image/jpeg;base64, '+obj.result.rgb);					

					var img = new Image();
					texture = new THREE.Texture(img); 
					img.onload = function() {
						texture.needsUpdate = true;
					};
					img.src = 'data:image/jpeg;base64, ' + obj.result.rgb.toString();
				
					mesh.material.map = texture;
					mesh.material.needsUpdate = true;

					debug(texture.image.width + "X" + texture.image.height);
				}
            };

			websocket.onclose = function (evt) {
				debug("disconnected");
				
				document.getElementById("window_config").style.display = "block";
				document.getElementById("window_render").style.display = "none";
				$('#text_server_uri').val(wsUri);
			};

			websocket.onerror = function (evt) {
				debug('error: ' + evt.data);
			};
		} catch (exception) {
			debug('error: ' + exception);
		}
	}

	function closeWs() {
		if (websocket)
			websocket.close();
	}

	function initGl() {
		debug("init opengl");

		display = document.getElementById( 'display' );
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );		
		display.appendChild( renderer.domElement );

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(45, renderer.domElement.width / renderer.domElement.height, 1, 100);
		camera.position.set(0.0, 0.0, 10.0); 
		camera.lookAt(0.0, 0.0, 0.0);
		scene.add(camera);

		
		var planeGeometry = new THREE.PlaneGeometry( 1, 1 );

		var boxGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0); 
		
		var uvTexture = new THREE.ImageUtils.loadTexture("img/UV_Grid_Sm.jpg"); 

		var planeMaterial = new THREE.MeshBasicMaterial({ 
			map:uvTexture, 
			side:THREE.DoubleSide 
		}); 
		
	

		mesh = new THREE.Mesh( planeGeometry, planeMaterial );
		mesh.position.set(0.0, 0.0, -5.0); 
		scene.add( mesh );

	
		debug("add stats");
		stats = new Stats();
		display.appendChild( stats.dom );

		onWindowResize();
		window.addEventListener( 'resize', onWindowResize, false );

		getFrameMessage();
		getFrameMessage();
		getFrameMessage();

		debug("opengl is ready");
	}

	function onWindowResize( event ) {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera = new THREE.PerspectiveCamera(45, renderer.domElement.width / renderer.domElement.height, 1, 100);
		debug("resize to "+ renderer.domElement.width + "X" + renderer.domElement.height);

		resizeMessage(renderer.domElement.width, renderer.domElement.height);		
	}

	function animateGl() {
	//	mesh.rotation.y += 0.1;

		requestAnimationFrame( animateGl );
		render();
		stats.update();
	}

	function render() {
		renderer.render( scene, camera );
	}

	function resizeMessage(w, h) {
		var msg = {
			"jsonrpc" : "2.0",
			"method" : "resize",
			"params" : { 
				"width" : w, 
				"height": h
			},
			"id" : idCnt
		};
		debug(JSON.stringify(msg));
		websocket.send(JSON.stringify(msg));
		idCnt++;
	}

	function getFrameMessage() {
		var msg = {
			"jsonrpc" : "2.0",
			"method" : "getFrame",
			"params" : {},
			"id" : idCnt
		};
		debug(JSON.stringify(msg));
		websocket.send(JSON.stringify(msg));
		idCnt++;
	}
});
