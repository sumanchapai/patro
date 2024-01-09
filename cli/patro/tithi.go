package main

var TithiUnicodeToRoman = map[string]string{
	"\u092a\u094d\u0930\u0924\u093f\u092a\u0926\u093e": "Prathama", // Also called Prathama
	"\u0926\u094d\u0935\u093f\u0924\u0940\u092f\u093e": "Dwitiya",
	"\u0924\u0943\u0924\u093f\u092f\u093e":             "Tritiya",
	"\u091a\u0924\u0941\u0930\u094d\u0925\u0940":       "Chaturthi",
	"\u092a\u091e\u094d\u091a\u092e\u0940":             "Panchami",
	"\u0937\u0937\u094d\u0920\u0940":                   "Shasthi",
	"\u0938\u092a\u094d\u0924\u092e\u0940":             "Saptami",
	"\u0905\u0937\u094d\u091f\u092e\u0940":             "Asthami",
	"\u0928\u0935\u092e\u0940":                         "Navami",
	"\u0926\u0936\u092e\u0940":                         "Dashami",
	"\u090f\u0915\u093e\u0926\u0936\u0940":             "Ekadashi",
	"\u0926\u094d\u0935\u093e\u0926\u0936\u0940":       "Dwadashi",
	"\u0924\u094d\u0930\u092f\u094b\u0926\u0936\u0940": "Trayodashi",
	"\u091a\u0924\u0941\u0930\u094d\u0926\u0936\u0940": "Chaturdashi",
	"\u092a\u0942\u0930\u094d\u0923\u093f\u092e\u093e": "Purnima",
	"\u0914\u0902\u0938\u0940":                         "Aausi",
}

// Return roman for given unicode tithi if exists
func RomanTithi(unicode string) string {
	if result, ok := TithiUnicodeToRoman[unicode]; ok {
		return result
	}
	return unicode
}
