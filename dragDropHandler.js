export class DragDropHandler {
  constructor() {
    this.draggedElement = null;
  }

  makeDraggable(element) {
    element.addEventListener('dragstart', (e) => {
      this.draggedElement = element;
      element.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', element.innerHTML);
    });

    element.addEventListener('dragend', () => {
      element.classList.remove('dragging');
    });
  }

  makeDroppable(dropZone, onDropCallback) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!dropZone.classList.contains('correct')) {
        dropZone.classList.add('drag-over');
      }
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');

      if (!this.draggedElement || dropZone.classList.contains('correct')) {
        return;
      }

      const countryName = this.draggedElement.dataset.country;
      const capitalName = dropZone.dataset.capital;

      dropZone.classList.add('filled');
      dropZone.innerHTML = this.draggedElement.innerHTML;

      onDropCallback(countryName, capitalName);
    });
  }
}
