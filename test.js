fetch("https://pl.dev.hxcd.now.hclsoftware.cloud/analyze/analyze.php", { method: "POST", body: JSON.stringify(
  '{"customerProperties": {
  "firstName": "Jill",
  "gender": "Female"
},
"type": "identify",
"userId": "jillsmith",
"id": "viz_679866e1ba4b9",
"originalTimestamp": 1739249226823,
"messageId": "a8fc5e8f-3732-4336-a4b3-23f83f507a46",
"writeKey": "zpgimm1j76dntmdfvryq",
"otherIds": {
  "_ga": "GA1.1.248022424.1738041058",
  "customerId": "jillsmith"
},
"context": {
  "library": {
    "name": "javascript"
  },
  "userAgent": {
    "deviceType": "DESKTOP",
    "osType": "Mac OS",
    "osVersion": "Mac OS X 10",
    "browser": "Chrome",
    "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
  },
  "page": {
    "path": "/index.html",
    "referrer": "https://hclcdp-insurance-6527.dev.hxcd.now.hclsoftware.cloud/life_term_insurance.html",
    "title": "Insurance",
    "url": "https://hclcdp-insurance-6527.dev.hxcd.now.hclsoftware.cloud/index.html"
  }
},
"deviceType": "Desktop"
}')
)