"use strict";

/**
 * HTL Use-API script — runs server-side in AEM (Rhino/GraalVM).
 *
 * Globals available in Sling scripting context:
 *   properties      — ValueMap of the current JCR node (the block node)
 *   resource        — current Sling Resource
 *   resourceResolver — ResourceResolver
 *
 * Resolves the Content Fragment at properties.reference and exposes its
 * fields to the HTL template.
 */
use(function () {
  var cfPath = properties.get("reference", "");
  if (!cfPath) return {};

  var cfResource = resourceResolver.getResource(cfPath);
  if (!cfResource) {
    return { cfPath: cfPath, aueCf: "urn:aemconnection:" + cfPath };
  }

  // Adapt to ContentFragment — available on all AEM instances with the CF feature.
  var cf = cfResource.adaptTo(Packages.com.adobe.cq.dam.cfm.ContentFragment);
  if (!cf) {
    return { cfPath: cfPath, aueCf: "urn:aemconnection:" + cfPath };
  }

  function field(name) {
    var el = cf.getElement(name);
    return el ? String(el.content) : "";
  }

  return {
    cfPath:      cfPath,
    // Full URN used by Universal Editor to locate the CF node.
    aueCf:       "urn:aemconnection:" + cfPath,
    title:       field("title"),
    description: field("description"),
    ctaText:     field("ctaText"),
    ctaLink:     field("ctaLink")
  };
});
