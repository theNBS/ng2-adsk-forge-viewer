export function createSimplePanel(
    panelContainer: HTMLElement,
    panelId: string,
    panelTitle: string,
    panelContent: Node,
    panelX: number,
    panelY: number,
  ) {
  let panel: SimplePanel;

  // Wrapping in function as Autodesk namespace might not be defined
  // Is there a better way?
  class SimplePanel extends Autodesk.Viewing.UI.DockingPanel {
    public content: Node;

    constructor(parentContainer: HTMLElement, id: string, title: string, content: any, x: number, y: number) {
      super(parentContainer, id, title, content);

      this.content = content;
      this.container.appendChild(this.content);

      // Auto-fit to the content and don't allow resize.  Position at the coordinates given.
      //
      this.container.style.height = '200px';
      this.container.style.width = '200px';
      // this.container.style.resize = 'none';
      this.container.style.left = x + 'px';
      this.container.style.top = y + 'px';
    }

    public initialize() {
      // Override DockingPanel initialize() to:
      // - create a standard title bar
      // - click anywhere on the panel to move
      // - create a close element at the bottom right
      //
      this.title = this.createTitleBar(this.titleLabel || this.container.id);
      this.container.appendChild(this.title);

      this.initializeMoveHandlers(this.container);

      this.closer = document.createElement('div');
      this.closer.className = 'simplePanelClose';
      this.closer.textContent = 'Close';

      this.initializeCloseHandler(this.closer);
      this.container.appendChild(this.closer);
    }
  }

  if (!panel) {
    panel = new SimplePanel(panelContainer, panelId, panelTitle, panelContent, panelX, panelY);
  }

  panel.setVisible(true);
  return panel;
}
