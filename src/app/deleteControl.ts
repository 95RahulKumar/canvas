import { fabric } from 'fabric';
export class DeleteControl extends fabric.Control {
  cornerSize = 24;
  deleteIconUrl = '../assets/images/delete.png';
  renderIcon(
    ctx?: CanvasRenderingContext2D,
    left?: number,
    top?: number,
    styleOverride?: fabric.IObjectOptions,
    fabricObject?: fabric.Object
  ): void {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    const imgIcon = document.createElement('img');
    imgIcon.src = this.deleteIconUrl;
    ctx.drawImage(imgIcon, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  override mouseUpHandler(
    eventData: MouseEvent,
    transformData: fabric.Transform,
    x: number,
    y: number
  ): boolean {
    const target = transformData.target as fabric.Object;
    const canvas = target.canvas;
    if (canvas) {
      canvas.remove(target);
      canvas.requestRenderAll();
      return true;
    }
    return false;
  }
}
