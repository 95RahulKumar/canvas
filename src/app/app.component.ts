import { AfterViewInit } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { Canvas } from 'fabric/fabric-impl';
import { DeleteControl } from './deleteControl';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'canvas';
  @ViewChild('canvasRef') canvasRef!: ElementRef;
  @ViewChild('container') container!: ElementRef;
  context!: CanvasRenderingContext2D;
  canvas!: Canvas;
  deleteControl: DeleteControl;
  ngOnInit(): void {}
  deafaultZoom: number = 1;
  ngAfterViewInit(): void {
    // this.initializeCanvas();
    this.initializeCanvasforFabric();
    this.deleteControl = new DeleteControl();
    this.resize();
  }

  resize = () => {
    window.addEventListener('resize', this.initializeCanvasforFabric);
  };

  initializeCanvasforFabric = () => {
    this.deafaultZoom = 1;
    const parentEle = document.getElementById('container');
    const canvas = new fabric.Canvas('canvas', {
      width: parentEle.offsetWidth,
      height: parentEle.offsetHeight,
    });
    this.canvas = canvas;
    fabric.Image.fromURL('../assets/images/orange.jpg', function (img) {
      const imageWidth = img.width;
      const imageHeight = img.height;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const hratio = canvasWidth / imageWidth;
      const vratio = canvasHeight / imageHeight;
      const ratio = Math.min(hratio, vratio);

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: ratio,
        scaleY: ratio,
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
      });
    });

    canvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      console.clear();
      console.log(opt.e);
      var pointer = canvas.getPointer(opt.e);
      var zoom = canvas.getZoom();
      zoom = zoom + delta / 200;
      this.deafaultZoom = zoom;
      if (zoom > 20) zoom = 20;
      if (zoom < 1) zoom = 1;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    let ispanning = false;
    canvas.on('mouse:down', function (event) {
      event.e.preventDefault();
      var target = canvas.findTarget(event.e, true);
      if (target) return;
      var rect = new fabric.Rect({
        left: event.e.offsetX - 30,
        top: event.e.offsetY - 30,
        width: 60,
        height: 60,
        stroke: 'lime',
        lockRotation: true,
        cornerStyle: 'circle',
        cornerStrokeColor: 'black',
        cornerColor: 'blue',
        fill: 'transparent',
        hasRotatingPoint: false,
      });
      rect.setControlsVisibility({ mtr: false });
      // rect.viewportCenter();
      console.log(rect);
      canvas.add(rect);

      fabric.Object.prototype.controls['deleteControl'] = new DeleteControl({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: 'pointer',
      });
      this.deleteControl.renderIcon();
      canvas.renderAll();

      ispanning = true;
      var pointer = canvas.getPointer(event.e);
    });
    canvas.on('mouse:move', function (event) {
      if (ispanning && event && event.e && this.deafaultZoom > 1) {
        var x = event.e.movementX;
        var y = event.e.movementY;
        if (!x) {
          x = event?.e?.screenX - (event as any)?.previousEvent.e.screenX;
          y = event?.e?.screenY - (event as any)?.previousEvent.e.screenY;
        }
        var delta = new fabric.Point(x, y);
        canvas.relativePan(delta);
        canvas.selection = false;
        (event as any).previousEvent = event;
      }
    });

    canvas.on('mouse:up', function (event) {
      event.e.preventDefault();
      ispanning = false;
    });
    // var isPanning = false;
    // var lastPosX = 0;
    // var lastPosY = 0;
    // canvas.on('mouse:down', function (event) {
    //   event.e.preventDefault();
    //   isPanning = true;
    //   var pointer = canvas.getPointer(event.e);
    //   lastPosX = pointer.x;
    //   lastPosY = pointer.y;
    //   canvas.defaultCursor = 'grabbing';
    //   canvas.renderAll();
    // });

    // canvas.on('mouse:move', function (event) {
    //   event.e.preventDefault();
    //   if (!isPanning) return;
    //   var pointer = canvas.getPointer(event.e);
    //   var deltaX = pointer.x - lastPosX;
    //   var deltaY = pointer.y - lastPosY;
    //   lastPosX = pointer.x;
    //   lastPosY = pointer.y;
    //   canvas.defaultCursor = 'grabbing';
    //   canvas.renderAll();
    //   canvas.relativePan(new fabric.Point(deltaX, deltaY));
    // });

    // canvas.on('mouse:up', function (event) {
    //   event.e.preventDefault();

    //   isPanning = false;
    //   canvas.defaultCursor = 'default';
    //   canvas.renderAll();
    // });
  };

  addObject(e: MouseEvent): void {
    if (e.target) return;
  }

  async initializeCanvas() {
    // await this.loadCanvasConfig();
    // this.loadImage();
  }

  // loadCanvasConfig(): Promise<boolean> {
  //   return new Promise((resolve) => {
  //     this.canvas = this.canvasRef?.nativeElement;
  //     this.context = this.canvas?.getContext('2d');
  //     resolve(true);
  //   });
  // }

  // loadImage() {
  //   let img = new Image();
  //   const url = `../assets/images/orange.jpg`;
  //   img.src = url;

  //   img.onload = () => {
  //     this.displayUIImage(this.context, img);
  //   };
  //   img.onerror = (err) => console.log(err);
  // }

  // displayUIImage(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  //   //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  //   const imageWidth = img.width;
  //   const imageHeight = img.height;
  //   const canvasWidth = this.canvas.width;
  //   const canvasHeight = this.canvas.height;
  //   const hratio = canvasWidth / imageWidth;
  //   const vratio = canvasHeight / imageHeight;
  //   const ratio = Math.min(hratio, vratio);
  //   const centerShiftX = (canvasWidth - imageWidth * ratio) / 2;
  //   const centerShiftY = (canvasHeight - imageHeight * ratio) / 2;
  //   const dw = imageWidth * ratio;
  //   const dh = imageHeight * ratio;
  //   ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  //   // ctx.imageSmoothingEnabled = false;
  //   ctx.drawImage(
  //     img,
  //     0,
  //     0,
  //     imageWidth,
  //     imageHeight,
  //     centerShiftX,
  //     centerShiftY,
  //     dw,
  //     dh
  //   );
  // }
}
