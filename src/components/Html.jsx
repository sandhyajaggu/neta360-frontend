// Renders trusted markup from our own translation files (e.g. <br>, <b>).
// Never pass user-entered text to this component.
export default function Html({ as: Tag = "span", html, ...rest }) {
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html }} />;
}
