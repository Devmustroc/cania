import {useCallback, useMemo, useRef, useState} from "react";
import {fabric} from "fabric";
import {useAutoResize} from "./use-auto-resize";
import {
    BuildEditorProps,
    CIRCLE_OPTIONS,
    DIAMOND_OPTIONS,
    EditorHookProps,
    EditorProps,
    FILL_COLOR,
    FONT_FAMILY, FONT_SIZE, FONT_STYLE, FONT_WEIGHT, JSON_KEYS,
    RECTANGLE_OPTIONS,
    STROKE_COLOR,
    STROKE_DASH_ARRAY,
    STROKE_WIDTH,
    TEXT_OPTIONS,
    TRIANGLE_OPTIONS
} from "../types";
import {useCanvasEvents} from "./use-canvas-events";
import {createFilter, downloadFile, isTextType, transformText} from "../utils";
import {useClipboard} from "@/features/editor/hooks/use-clipboard";
import {useHistoryHook} from "@/features/editor/hooks/use-history-hook";
import {useHotKeys} from "@/features/editor/hooks/use-hot-keys";
import {useWindowEvent} from "@/features/editor/hooks/use-window-event";
import {useLoadState} from "@/features/editor/hooks/use-load-state";


const buildEditor = ({
        canvas ,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObject,
        strokeDashArray,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
        copy,
        paste,
        autoZoom,
        canUndo,
        canRedo,
        save,
        undo,
        redo
}: BuildEditorProps) : EditorProps => {
    const getWorkSpace = () => {

        let workspace: fabric.Rect | undefined;
        workspace = canvas.getObjects().find((object) => {
            return object.name === "clip"
        });
        return workspace;
    }
    const generateSaveOptions = () => {
        const {width, height, left, top} = getWorkSpace() as fabric.Rect;

        return {
            name:"Image",
            format: "png",
            quality: 1,
            width: width,
            height: height,
            left: left,
            top: top,
        };
    }



    const saveAsPng = () => {
        const options = generateSaveOptions();

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toDataURL(options);

        downloadFile(dataUrl, "png")
        autoZoom()
    }

    const saveAsSvg = () => {
        const options = generateSaveOptions();

        canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        const dataUrl = canvas.toSVG(options);
        downloadFile(dataUrl, "svg")
        autoZoom()
    }

    const saveAsJpeg = () => {
        const options = generateSaveOptions();

        const dataUrl = canvas.toDataURL(options);

        downloadFile(dataUrl, "jpg")
        autoZoom()
    }

    const saveAsJson = async () => {
        const dataUrl = canvas.toJSON(JSON_KEYS);

        await transformText(dataUrl.objects);
        const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, 2))}`;
        downloadFile(fileString, "json")

    }

    const loadJson = (json: string) => {
        const data = JSON.parse(json);

        canvas.loadFromJSON(data, () => {
            autoZoom()
        })
    }

    const center = (object: fabric.Object) => {
        const workspace = getWorkSpace();
        const center = workspace?.getCenterPoint();

        if (!center) return;

        // @ts-ignore
        canvas._centerObject(object, center)
    }
    const addToCanvas = (object: fabric.Object) => {
        center(object)
        canvas.add(object)
        canvas.setActiveObject(object)
    }
    return {
        saveAsPng,
        saveAsSvg,
        saveAsJpeg,
        saveAsJson,
        loadJson,
        autoZoom,
        zoomIn: () => {
            let zoomRatio = canvas.getZoom();
            zoomRatio += 0.05;
            const center = canvas.getCenter();
            canvas.zoomToPoint(
                new fabric.Point(center.left, center.top),
                zoomRatio
            );
        },
        zoomOut: () => {
            let zoomRatio = canvas.getZoom();
            zoomRatio -= 0.05;
            const center = canvas.getCenter();
            canvas.zoomToPoint(
                new fabric.Point(center.left, center.top),
                zoomRatio < 0.2 ? 0.2 : zoomRatio
            );
        },
        getWorkSpace: () => getWorkSpace(),
        changeSize: (size: { width: number, height: number} ) => {
            const worksapce = getWorkSpace();

            worksapce?.set(size)
            autoZoom()
            save()
        },
        changeBackground: (value: string) => {
            const workspace = getWorkSpace();

            workspace?.set({ fill: value})
            canvas.renderAll()
            save()
        },
        enabledDrawingMode: () => {
            canvas.discardActiveObject();
            canvas.renderAll();
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = strokeWidth;
            canvas.freeDrawingBrush.color = strokeColor;
        },
        disabledDrawingMode: () => {
            canvas.isDrawingMode = false;
        },
        onUndo: () => undo(),
        onRedo: () => redo(),
        canUndo: () => canUndo(),
        canRedo: () => canRedo(),
        copy: () => copy(),
        paste: () => paste(),
        deleteActiveObject: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.remove(object)
            })
            canvas.discardActiveObject();
            canvas.renderAll()
        },
        addText: (value, options) => {
            const object = new fabric.Textbox(value, {
                ...TEXT_OPTIONS,
                fill: fillColor,
                ...options
            })
            addToCanvas(object)
        },
        addCircle: () => {
           const object = new fabric.Circle({
               ...CIRCLE_OPTIONS,
               fill: fillColor,
               stroke: strokeColor,
               strokeWidth: strokeWidth,
                strokeDashArray
           });
            addToCanvas(object)
        },
        addSoftRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                rx: 40,
                ry: 40,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray

            });
            addToCanvas(object)
        },
        addRectangle: () => {
            const object = new fabric.Rect({
                ...RECTANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray
            });
            addToCanvas(object)
        },
        addTriangle: () => {
            const object = new fabric.Triangle({
                ...TRIANGLE_OPTIONS,
                fill: fillColor,
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                strokeDashArray
            });
            addToCanvas(object)
        },
        addInverseTriangle: () => {
            const HEIGHT = 400;
            const WIDTH = 400;
            const object = new fabric.Polygon(
                [
                    {x: 0 , y: 0},
                    {x: WIDTH, y: 0},
                    {x: WIDTH / 2, y: HEIGHT}
                ],
                {
                    ...TRIANGLE_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray
                }
            );
            addToCanvas(object)
        },
        addDiamond: () => {
            const HEIGHT = DIAMOND_OPTIONS.height;
            const WIDTH = DIAMOND_OPTIONS.width;
            const object = new fabric.Polygon(
                [
                    {x: WIDTH / 2 , y: 0},
                    {x: WIDTH, y: HEIGHT / 2},
                    {x: WIDTH / 2, y: HEIGHT},
                    {x: 0, y: HEIGHT / 2}
                ],
                {
                    ...DIAMOND_OPTIONS,
                    fill: fillColor,
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    strokeDashArray
                }
            )
            addToCanvas(object)
        },
        addImage: (url: string) => {
            fabric.Image.fromURL(url, (image) => {
                const workspace = getWorkSpace();
                image.scaleToWidth(workspace?.width || 0)
                image.scaleToHeight(workspace?.height || 0)
                addToCanvas(image)
            },
                {
                    crossOrigin: "anonymous"
            })
        },
        getActiveFilters: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return [];
            }

            // @ts-ignore
            const value = selected.get('filter') || [];

            return value;
        },
        getActiveColor: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return fillColor;
            }

            const value = selected.get('fill') || fillColor;

            return value as string;
        },
        getActiveFontFamily: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return FONT_FAMILY;
            } // @ts-ignore
            const value = selected.get('fontFamily') || FONT_FAMILY;

            return value;
        },
        getActiveFontWeight: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return FONT_WEIGHT;
            } // @ts-ignore
            const value = selected.get('fontWeight') || FONT_WEIGHT;

            return value;
        },
        getActiveFontStyle: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return FONT_STYLE;
            } // @ts-ignore
            const value = selected.get('fontWeight') || FONT_STYLE;

            return value;
        },
        getActiveFontLineThrough: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return false;
            } // @ts-ignore
            const value = selected.get('linethrough') || false;

            return value;
        },
        getActiveFontUnderline: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return false;
            } // @ts-ignore
            const value = selected.get('underline') || false;

            return value;
        },
        getActiveFontSize: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return FONT_SIZE;
            } // @ts-ignore
            const value = selected.get('fontSize') || FONT_SIZE;

            return value;
        },
        getActiveTextAlign: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return "left";
            } // @ts-ignore
            const value = selected.get('textAlign') || "left";

            return value;
        },
        getActiveStrokeColor: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return fillColor;
            }

            const value = selected.get('stroke') || STROKE_COLOR;

            return value;
        },
        getActiveStrokeWidth: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return strokeWidth;
            }

            const value = selected.get('strokeWidth') || STROKE_WIDTH;

            return value;
        },
        getActiveStrokeDashedArray: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return strokeDashArray;
            }

            const value = selected.get('strokeDashArray') || STROKE_DASH_ARRAY;

            return value;
        },
        getActiveOpacity: () => {
            const selected = selectedObject[0];
            if (!selected) {
                return 1;
            }

            const value = selected.get('opacity') || 1;

            return value;
        },
        changeOpacity: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                object.set({opacity: value})
            })

            canvas.renderAll()
        },
        bringForward: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.bringForward(object)
            })
            canvas.renderAll()
            const workspace = getWorkSpace();
            workspace?.sendToBack()
        },
        sendBackward: () => {
            canvas.getActiveObjects().forEach((object) => {
                canvas.sendBackwards(object)
            })
            canvas.renderAll()

            const workspace = getWorkSpace();
            workspace?.sendToBack()
        },
        changeImageFilter: (value: string) => {
            const objects = canvas.getActiveObjects();
            objects.forEach((object) => {
                if (object.type === "image") {
                    // @ts-ignore
                    const imageObject = object as fabric.Image;
                    const effect = createFilter(value)

                    imageObject.filters = effect ? [effect] : []
                    imageObject.applyFilters()
                    canvas.renderAll()
                }
            })
        },
        changeFontFamily: (value: string) => {
            setFontFamily(fontFamily);
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({"fontFamily": value })
                }
            })
            canvas.renderAll()
        },
        changeFontWeight: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({"fontWeight": value })
                }
            })

            canvas.renderAll()
        },
        changeFontStyle: (value: string) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({"fontStyle": value })
                }
            })

            canvas.renderAll()
        },
        changeFontLineTrough: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({ linethrough: value })
                }
            })

            canvas.renderAll()
        },
        changeFontUnderline: (value: boolean) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({ underline: value })
                }
            })

            canvas.renderAll()
        },
        changeFontSize: (value: number) => {
            canvas.getActiveObjects().forEach((object) => {
                if(isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({fontSize: value})
                }
            })

            canvas.renderAll()
        },
        changeTextAlign: (value: string) => {
            canvas.getActiveObjects().forEach((object) => {
                if (isTextType(object.type))
                {
                    // @ts-ignore
                    object.set({ textAlign: value })
                }
            })

            canvas.renderAll()
        },
        changeFillColor: (color: string) => {
            setFillColor(color)
            canvas.getActiveObjects().forEach((object) => {
                object.set({fill: color})
            });
            canvas.renderAll()
        },
        changeStrokeColor: (color: string) => {
            setStrokeColor(color)
            canvas.getActiveObjects().forEach((object) => {
                // Text objects do not have stroke
                if (isTextType(object.type)) {
                    object.set({ fill: color })
                    return
                }
                object.set({ stroke: color })
            })
            canvas.freeDrawingBrush.color = color;
            canvas.renderAll()
        },
        changeStrokeWidth: (width: number) => {
            setStrokeWidth(width)
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeWidth: width })
            })
            canvas.freeDrawingBrush.width = width;
            canvas.renderAll()
        },
        changeStrokeDashArray: (dashArray: number[]) => {
            setStrokeDashArray(dashArray);
            canvas.getActiveObjects().forEach((object) => {
                object.set({ strokeDashArray: dashArray })
            })

            canvas.renderAll()

        },
        selectedObject,
        canvas
    }
}

export const useEditor = ({
    onClearSelectionCallback,
    saveCallback,
    defaultState,
    defaultWidth,
    defaultHeight
} : EditorHookProps) => {
    const initialState = useRef(defaultState);
    const initialHeight = useRef(defaultHeight);
    const initialWidth = useRef(defaultWidth);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object[]>([]);
    const [fillColor, setFillColor] = useState(FILL_COLOR);
    const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
    const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
    const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);
    const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);

    const { save, canUndo, canRedo, undo, redo, canvasHistory, setHistoryIdx } = useHistoryHook({
        canvas,
        saveCallback
    });

    const { copy, paste }= useClipboard({ canvas})

    const { autoZoom } = useAutoResize({
        canvas,
        container
    });

    useCanvasEvents({
        canvas,
        setSelectedObject,
        onClearSelectionCallback,
        save
    });

    useHotKeys({
        canvas,
        undo,
        redo,
        save,
        copy,
        paste
    });

    useWindowEvent();

    useLoadState({
        autoZoom,
        canvas,
        initialState,
        canvasHistory,
        setHistory: setHistoryIdx
    })

    const editor = useMemo(() => {
        if (canvas) {
            return buildEditor({
                autoZoom,
                canvas,
                fillColor,
                setFillColor,
                strokeColor,
                setStrokeColor,
                strokeDashArray,
                strokeWidth,
                setStrokeWidth,
                selectedObject,
                setStrokeDashArray,
                fontFamily,
                setFontFamily,
                copy,
                paste,
                save,
                undo,
                redo,
                canUndo,
                canRedo
            })
        }
        return undefined
    }, [
        canvas,
        fillColor,
        setFillColor,
        strokeColor,
        setStrokeColor,
        strokeWidth,
        setStrokeWidth,
        selectedObject,
        strokeDashArray,
        setStrokeDashArray,
        fontFamily,
        setFontFamily,
        copy,
        paste,
        autoZoom,
        save,
        undo,
        redo,
        canUndo,
        canRedo
    ]);

    const init = useCallback((
        {
            initialCanvas,
            initialContainer
        } : {
            initialCanvas: fabric.Canvas,
            initialContainer: HTMLDivElement
        }
    ) => {
        fabric.Object.prototype.set({
            cornerColor: "#fff",
            cornerStyle: "circle",
            borderColor: "#3b82f6",
            borderScaleFactor: 1.5,
            transparentCorners: false,
            borderOpacityWhenMoving: 1,
            cornerStrokeColor: "#3b82f6"
        })

        const initialWorkSpace = new fabric.Rect({
            width: initialWidth.current,
            height: initialHeight.current,
            name: "clip",
            fill: 'white',
            selectable: false,
            hasControls: false,
            shadow: new fabric.Shadow({
                color: "rgba(0,0,0,0.8)",
                blur: 5
            }),
        });
        initialCanvas.setWidth(
            initialContainer.offsetWidth
        );
        initialCanvas.setHeight(
            initialContainer.offsetHeight
        )

        initialCanvas.add(initialWorkSpace)
        initialCanvas.centerObject(initialWorkSpace)
        initialCanvas.clipPath = initialWorkSpace

        setCanvas(initialCanvas)
        setContainer(initialContainer)
        const currentState = JSON.stringify(
            initialCanvas.toJSON(JSON_KEYS)
        );

        canvasHistory.current = [currentState];
        setHistoryIdx(0);

    }, [
        canvasHistory,
        setHistoryIdx
    ]);



    return { init , editor }
}