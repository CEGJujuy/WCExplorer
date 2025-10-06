export class DragDropHandler {
  constructor() {
    this.draggedElement = null;
    console.log('DragDropHandler initialized');
  }

  makeDraggable(element) {
    console.log('Making draggable:', element.textContent);
    element.addEventListener('dragstart', (e) => {
      console.log('Drag started:', element.textContent);
      this.draggedElement = element;
      element.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', element.innerHTML);
    });

    element.addEventListener('dragend', () => {
      console.log('Drag ended');
      element.classList.remove('dragging');
    });
  }

  makeDroppable(dropZone, onDropCallback) {
    console.log('Making droppable:', dropZone.textContent);
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
      console.log('Dropped on:', dropZone.dataset.capital);
      dropZone.classList.remove('drag-over');

      if (!this.draggedElement || dropZone.classList.contains('correct')) {
        return;
      }

      const countryName = this.draggedElement.dataset.country;
      const capitalName = dropZone.dataset.capital;

      console.log('Country:', countryName, 'Capital:', capitalName);

      dropZone.classList.add('filled');
      dropZone.innerHTML = this.draggedElement.innerHTML;

      onDropCallback(countryName, capitalName);
    });
  }
}
