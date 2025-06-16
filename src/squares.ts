/**
 * Ejercicio 1.3 - Cuadrados Concéntricos
 * Adaptación del ejercicio de triángulos del libro, pero usando cuadrados
 * Implementa el sistema de coordenadas lógicas vs. coordenadas de dispositivo
 */

interface Point {
    x: number;
    y: number;
}

class CoordinateSystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private maxX!: number;
    private maxY!: number;
    private minMaxXY!: number;
    private xCenter!: number;
    private yCenter!: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('No se pudo obtener el contexto 2D del canvas');
        }
        this.ctx = context;
        this.initGraphics();
    }

    /**
     * Inicializa las variables gráficas basadas en el tamaño del canvas
     */
    private initGraphics(): void {
        this.maxX = this.canvas.width - 1;
        this.maxY = this.canvas.height - 1;
        this.minMaxXY = Math.min(this.maxX, this.maxY);
        this.xCenter = this.maxX / 2;
        this.yCenter = this.maxY / 2;
    }

    /**
     * Convierte coordenada lógica X a coordenada de dispositivo X
     * @param x Coordenada lógica X (float)
     * @returns Coordenada de dispositivo X (integer)
     */
    private iX(x: number): number {
        return Math.round(x);
    }

    /**
     * Convierte coordenada lógica Y a coordenada de dispositivo Y
     * Nota: Invierte la dirección del eje Y (lógico apunta hacia arriba, dispositivo hacia abajo)
     * @param y Coordenada lógica Y (float)
     * @returns Coordenada de dispositivo Y (integer)
     */
    private iY(y: number): number {
        return this.maxY - Math.round(y);
    }

    /**
     * Convierte coordenada de dispositivo X a coordenada lógica X
     * @param x Coordenada de dispositivo X (integer)
     * @returns Coordenada lógica X (float)
     */
    private fx(x: number): number {
        return parseFloat(x.toString());
    }

    /**
     * Convierte coordenada de dispositivo Y a coordenada lógica Y
     * @param y Coordenada de dispositivo Y (integer)
     * @returns Coordenada lógica Y (float)
     */
    private fy(y: number): number {
        return parseFloat((this.maxY - y).toString());
    }

    /**
     * Dibuja una línea usando coordenadas lógicas
     * @param x1 Coordenada lógica X del punto inicial
     * @param y1 Coordenada lógica Y del punto inicial
     * @param x2 Coordenada lógica X del punto final
     * @param y2 Coordenada lógica Y del punto final
     */
    private drawLine(x1: number, y1: number, x2: number, y2: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(this.iX(x1), this.iY(y1));
        this.ctx.lineTo(this.iX(x2), this.iY(y2));
        this.ctx.stroke();
    }

    /**
     * Limpia el canvas
     */
    public clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Dibuja un cuadrado usando coordenadas lógicas
     * @param vertices Array de 4 puntos que forman el cuadrado
     */
    private drawSquare(vertices: Point[]): void {
        if (vertices.length !== 4) {
            throw new Error('Un cuadrado debe tener exactamente 4 vértices');
        }

        // Dibujar los 4 lados del cuadrado
        for (let i = 0; i < 4; i++) {
            const current = vertices[i];
            const next = vertices[(i + 1) % 4]; // El último vértice se conecta con el primero
            this.drawLine(current.x, current.y, next.x, next.y);
        }
    }

    /**
     * Calcula los nuevos vértices del cuadrado para la siguiente iteración
     * Cada vértice se mueve hacia el siguiente vértice en sentido contrario a las agujas del reloj
     * @param vertices Vértices del cuadrado actual
     * @param p Factor de retención (1-q)
     * @param q Factor de movimiento hacia el siguiente vértice
     * @returns Nuevos vértices del cuadrado
     */
    private calculateNextSquare(vertices: Point[], p: number, q: number): Point[] {
        const newVertices: Point[] = [];
        
        for (let i = 0; i < 4; i++) {
            const current = vertices[i];
            const next = vertices[(i + 1) % 4]; // Próximo vértice en sentido contrario a las agujas del reloj
            
            // Cada vértice se mueve hacia el siguiente vértice
            const newX = p * current.x + q * next.x;
            const newY = p * current.y + q * next.y;
            
            newVertices.push({ x: newX, y: newY });
        }
        
        return newVertices;
    }

    /**
     * Método principal que dibuja 50 cuadrados concéntricos
     */
    public drawConcentricSquares(): void {
        this.clear();
        
        // Configuración del estilo de línea
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 1;
        
        // Tamaño inicial del cuadrado (95% del menor entre ancho y alto)
        const side: number = 0.95 * this.minMaxXY;
        const sideHalf: number = 0.5 * side;
        
        // Factores de transformación
        const q: number = 0.05; // Factor de contracción (5%)
        const p: number = 1 - q; // Factor de mantenimiento (95%)
        
        // Vértices iniciales del cuadrado en coordenadas lógicas
        // Orden: inferior-izquierda, inferior-derecha, superior-derecha, superior-izquierda
        let vertices: Point[] = [
            { x: this.xCenter - sideHalf, y: this.yCenter - sideHalf }, // A: inferior-izquierda
            { x: this.xCenter + sideHalf, y: this.yCenter - sideHalf }, // B: inferior-derecha
            { x: this.xCenter + sideHalf, y: this.yCenter + sideHalf }, // C: superior-derecha
            { x: this.xCenter - sideHalf, y: this.yCenter + sideHalf }  // D: superior-izquierda
        ];
        
        // Dibujar 50 cuadrados concéntricos
        for (let i = 0; i < 50; i++) {
            // Cambiar el color gradualmente para visualizar mejor los cuadrados
            const hue = (i * 7) % 360;
            this.ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
            
            // Dibujar el cuadrado actual
            this.drawSquare(vertices);
            
            // Calcular los vértices del siguiente cuadrado
            // IMPORTANTE: Usamos las coordenadas flotantes, no las convertidas a enteros
            vertices = this.calculateNextSquare(vertices, p, q);
        }
    }

    /**
     * Reinicializa el sistema de coordenadas (útil cuando cambia el tamaño del canvas)
     */
    public reinitialize(): void {
        this.initGraphics();
    }
}

/**
 * Clase principal para manejar la aplicación
 */
class SquareApplication {
    private coordSystem: CoordinateSystem;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`No se encontró el canvas con id: ${canvasId}`);
        }
        
        this.coordSystem = new CoordinateSystem(canvas);
        this.setupEventListeners();
    }

    /**
     * Configura los event listeners para los botones y eventos de ventana
     */
    private setupEventListeners(): void {
        // Botón para redibujar
        const redrawButton = document.getElementById('redrawButton');
        if (redrawButton) {
            redrawButton.addEventListener('click', () => this.redraw());
        }

        // Botón para cambiar tamaño
        const resizeButton = document.getElementById('resizeButton');
        if (resizeButton) {
            resizeButton.addEventListener('click', () => this.changeCanvasSize());
        }

        // Redimensionar automáticamente cuando cambia el tamaño de la ventana
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.coordSystem.reinitialize();
                this.coordSystem.drawConcentricSquares();
            }, 100);
        });
    }

    /**
     * Redibuja los cuadrados
     */
    public redraw(): void {
        this.coordSystem.drawConcentricSquares();
    }

    /**
     * Cambia el tamaño del canvas aleatoriamente
     */
    private changeCanvasSize(): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (canvas) {
            const newWidth = Math.floor(Math.random() * 400 + 400); // Entre 400 y 800
            const newHeight = Math.floor(Math.random() * 300 + 300); // Entre 300 y 600
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            this.coordSystem.reinitialize();
            this.coordSystem.drawConcentricSquares();
        }
    }

    /**
     * Inicia la aplicación
     */
    public start(): void {
        this.coordSystem.drawConcentricSquares();
    }
}

// Exponer funciones globales para ser llamadas desde el HTML
declare global {
    interface Window {
        redraw: () => void;
        changeSize: () => void;
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    const app = new SquareApplication('canvas');
    app.start();
    
    // Exponer funciones globalmente para los botones HTML
    window.redraw = () => app.redraw();
    window.changeSize = () => app['changeCanvasSize']();
});

export { CoordinateSystem, SquareApplication };