<frontmatter>
  title: Development Concepts
</frontmatter>

<br>

Use the existence of an data attribute to see where to insert the data. e.g.
* `<div data-customviews-viewA/>`  -> we should pump stuff here.

We must define:
* Set of placeholder values
* Set of toggles


A state can have:
* At most ONE placeholder value 
* A set of toggle values.

Hence, the master JSON must support:
* A set of placeholder values (where 0 or 1 is selected at a time)
* A set of toggle views (where 0 or more selected at one time.)


## Placeholders

Placeholders are for content that is mutually exclusive — i.e., only one variant can exist at a time. These are slots where you can swap in different content depending on the selected “view” or profile. This can be used for e.g.
* Branding / Logos (Show different logo depending on region, partner)
* Welcome text
* Main banner images
* Language or Locale Variants

