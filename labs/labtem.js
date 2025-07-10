let components = [];
let wires = [];
let history = [];
let undoneHistory = [];
let isDrawingWire = false;
let currentWire = null;
let startComponent = null;


// Ensure DOM is ready before binding any events or rendering
document.addEventListener('DOMContentLoaded', () => {
    // Attach sidebar button events if not already inline
    // (If you use inline onclick, this is not strictly needed)
});

// Component management
function addComponent(type) {
    const component = {
        id: Date.now(),
        type,
        x: 100,
        y: 100,
        connections: []
    };

    components.push(component);
    updateHistory();
    renderComponent(component);
}

function renderComponent(component) {
    // Use the dedicated component layer for rendering
    const canvas = document.querySelector('.component-layer');
    if (!canvas) {
        console.error('Component layer not found!');
        return;
    }
    const el = document.createElement('div');
    el.className = `component ${component.type}`;
    el.id = `comp-${component.id}`;
    // Use only left/top for initial placement, not transform
    el.style.left = `${component.x}px`;
    el.style.top = `${component.y}px`;
    el.style.transform = '';

    // Add connection points for battery, bulb, and switch
    if (component.type === 'battery' || component.type === 'bulb' || component.type === 'switch') {
        // Left terminal
        const left = document.createElement('div');
        left.className = 'connection-point';
        left.style.left = '0%';
        left.style.top = '50%';
        left.dataset.terminal = 'left';
        left.addEventListener('mousedown', (e) => startWireFromTerminal(e, component, 'left'));
        el.appendChild(left);
        // Right terminal
        const right = document.createElement('div');
        right.className = 'connection-point';
        right.style.left = '100%';
        right.style.top = '50%';
        right.dataset.terminal = 'right';
        right.addEventListener('mousedown', (e) => startWireFromTerminal(e, component, 'right'));
        el.appendChild(right);
    }

    if (component.type.includes('port')) {
        el.classList.add('port');
        el.textContent = component.type === 'positive' ? '+' : '-';
    } else if (component.type === 'bulb') {
        el.classList.add('bulb');
    }

    makeDraggable(el, component);
    canvas.appendChild(el);
}

// Draggable functionality
function makeDraggable(el, component) {
    // Save interactable instance for later enabling/disabling
    el._interactable = interact(el).draggable({
        listeners: {
            move(event) {
                component.x += event.dx;
                component.y += event.dy;
                // Use left/top for movement, not transform
                event.target.style.left = `${component.x}px`;
                event.target.style.top = `${component.y}px`;
                event.target.style.transform = '';
                updateConnectedWires(component);
            }
        }
    });
}

function updateConnectedWires(component) {
    wires.forEach(wire => {
        if (wire.startComponent === component.id || wire.endComponent === component.id) {
            drawWire(wire);
        }
    });
}

// Wire functionality
function toggleWireMode() {
    isDrawingWire = !isDrawingWire;
    document.querySelectorAll('.component').forEach(el => {
        if (isDrawingWire) {
            // Lock position: remove interact.js draggable
            if (el._interactable) {
                el._interactable.draggable(false);
            }
            el.style.cursor = 'crosshair';
        } else {
            // Unlock position: re-enable interact.js draggable
            if (el._interactable) {
                el._interactable.draggable(true);
            }
            el.style.cursor = 'move';
        }
    });
}

    // Only allow wire drawing from connection points
    // No-op here, handled by startWireFromTerminal
    // (function intentionally left blank)

function startWireFromTerminal(e, component, terminal) {
    if (!isDrawingWire) return;
    e.stopPropagation();
    // Start wire from this terminal
    startComponent = { ...component };
    const pos = getTerminalPosition(component, terminal);
    currentWire = {
        id: Date.now(),
        startX: pos.x,
        startY: pos.y,
        endX: pos.x,
        endY: pos.y,
        startComponent: component.id,
        startTerminal: terminal,
        endComponent: null,
        endTerminal: null,
        element: null
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleWireMouseUp);
}

function handleWireMouseUp(e) {
    if (!isDrawingWire || !currentWire) return;
    // Only allow wire if snapped to a connection point
    if (currentWire.endComponent && currentWire.startComponent !== currentWire.endComponent) {
        wires.push(currentWire);
        drawWire(currentWire);
        updateHistory();
    } else {
        if (currentWire.element) currentWire.element.remove();
    }
    currentWire = null;
    startComponent = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleWireMouseUp);
}

function handleMouseMove(e) {
    if (!isDrawingWire || !currentWire) return;
    // Snap to nearest connection point if hovering
    let found = false;
    document.querySelectorAll('.connection-point').forEach(point => {
        const parentId = point.parentElement.id.replace('comp-', '');
        const comp = components.find(c => c.id == parentId);
        if (!comp) return;
        const term = point.dataset.terminal;
        const pos = getTerminalScreenPosition(comp, term);
        const mx = e.clientX, my = e.clientY;
        // Use a radius for easier snapping
        const radius = 12;
        if (Math.abs(mx - pos.x) < radius && Math.abs(my - pos.y) < radius) {
            currentWire.endX = getTerminalPosition(comp, term).x;
            currentWire.endY = getTerminalPosition(comp, term).y;
            currentWire.endComponent = comp.id;
            currentWire.endTerminal = term;
            found = true;
        }
    });
    if (!found) {
        // Use the SVG wire-layer's bounding box for coordinates
        const canvasRect = document.getElementById('canvas').getBoundingClientRect();
        currentWire.endX = e.clientX - canvasRect.left;
        currentWire.endY = e.clientY - canvasRect.top;
        currentWire.endComponent = null;
        currentWire.endTerminal = null;
    }
    // Draw the preview wire as a line in the wire-layer SVG
    let wireLayer = document.querySelector('.wire-layer');
    if (!wireLayer) {
        wireLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        wireLayer.classList.add('wire-layer');
        wireLayer.setAttribute('width', document.getElementById('canvas').offsetWidth);
        wireLayer.setAttribute('height', document.getElementById('canvas').offsetHeight);
        wireLayer.style.position = 'absolute';
        wireLayer.style.top = '0';
        wireLayer.style.left = '0';
        wireLayer.style.width = '100%';
        wireLayer.style.height = '100%';
        wireLayer.style.pointerEvents = 'none';
        wireLayer.style.zIndex = '20';
        document.getElementById('canvas').prepend(wireLayer);
    }
    if (!currentWire.element) {
        currentWire.element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        currentWire.element.classList.add('wire-path', 'drawing-wire');
        wireLayer.appendChild(currentWire.element);
    }
    currentWire.element.setAttribute('x1', currentWire.startX);
    currentWire.element.setAttribute('y1', currentWire.startY);
    currentWire.element.setAttribute('x2', currentWire.endX);
    currentWire.element.setAttribute('y2', currentWire.endY);
    currentWire.element.setAttribute('stroke', '#444');
    currentWire.element.setAttribute('stroke-width', 6);
    currentWire.element.setAttribute('opacity', 0.7);
    currentWire.element.setAttribute('stroke-linecap', 'round');
    currentWire.element.style.display = 'block';
}

function handleMouseUp(e) {
    // No-op: wire mouseup is handled globally for better UX
}

function getTerminalPosition(component, terminal) {
    // Returns the absolute position of a terminal ('left' or 'right') for battery/bulb/switch
    let width = 40, height = 60;
    if (component.type === 'bulb') { width = 50; height = 50; }
    if (component.type === 'battery') { width = 40; height = 60; }
    if (component.type === 'switch') { width = 40; height = 20; }
    if (terminal === 'left') {
        return { x: component.x, y: component.y + height / 2 };
    } else if (terminal === 'right') {
        return { x: component.x + width, y: component.y + height / 2 };
    }
    // fallback: center
    return { x: component.x + width / 2, y: component.y + height / 2 };
}

function getTerminalScreenPosition(component, terminal) {
    // Returns the screen (absolute) position of a terminal for mouse hit-testing
    let width = 40, height = 60;
    if (component.type === 'bulb') { width = 50; height = 50; }
    if (component.type === 'battery') { width = 40; height = 60; }
    if (component.type === 'switch') { width = 40; height = 20; }
    const canvasRect = document.getElementById('canvas').getBoundingClientRect();
    let x, y;
    if (terminal === 'left') {
        x = component.x;
        y = component.y + height / 2;
    } else if (terminal === 'right') {
        x = component.x + width;
        y = component.y + height / 2;
    } else {
        x = component.x + width / 2;
        y = component.y + height / 2;
    }
    return {
        x: canvasRect.left + x,
        y: canvasRect.top + y
    };
}

function drawWire(wire) {
    const startComp = components.find(c => c.id === wire.startComponent);
    const endComp = components.find(c => c.id === wire.endComponent);
    if (!startComp || !endComp) return;

    // Always use the .wire-layer SVG for wires
    let wireLayer = document.querySelector('.wire-layer');
    if (!wireLayer) {
        wireLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        wireLayer.classList.add('wire-layer');
        wireLayer.setAttribute('width', document.getElementById('canvas').offsetWidth);
        wireLayer.setAttribute('height', document.getElementById('canvas').offsetHeight);
        wireLayer.style.position = 'absolute';
        wireLayer.style.top = '0';
        wireLayer.style.left = '0';
        wireLayer.style.width = '100%';
        wireLayer.style.height = '100%';
        wireLayer.style.pointerEvents = 'none';
        wireLayer.style.zIndex = '20'; // ensure above grid
        document.getElementById('canvas').prepend(wireLayer);
    }
    if (!wire.element) {
        wire.element = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        wire.element.classList.add('wire-path');
        wireLayer.appendChild(wire.element);
    }

    // Use the actual terminals if available
    let startTerminal = wire.startTerminal || 'right';
    let endTerminal = wire.endTerminal || 'left';
    const start = getTerminalPosition(startComp, startTerminal);
    const end = getTerminalPosition(endComp, endTerminal);
    wire.element.setAttribute('x1', start.x);
    wire.element.setAttribute('y1', start.y);
    wire.element.setAttribute('x2', end.x);
    wire.element.setAttribute('y2', end.y);

    // Color logic: red for 1, green for 0, gray for unknown
    let color = '#888';
    if (startComp.type === 'battery') {
        if (startTerminal === 'right') color = 'red'; // 1
        else if (startTerminal === 'left') color = 'green'; // 0
    } else {
        // Try to infer signal from previous propagation
        const key = startComp.id + ':' + startTerminal;
        wires.forEach(w => {
            if (w.endComponent === startComp.id && w.endTerminal === startTerminal) {
                const fromComp = components.find(c => c.id === w.startComponent);
                if (fromComp && fromComp.type === 'battery') {
                    if (w.startTerminal === 'right') color = 'red';
                    else if (w.startTerminal === 'left') color = 'green';
                }
            }
        });
    }
    wire.element.setAttribute('stroke', color);
    wire.element.setAttribute('stroke-width', 8);
    wire.element.setAttribute('opacity', 1);
    wire.element.setAttribute('stroke-linecap', 'round');
    wire.element.style.display = 'block';
}

// Undo/Redo functionality
function updateHistory() {
    history.push({
        components: [...components],
        wires: [...wires]
    });
    undoneHistory = [];
}

function undo() {
    if (history.length > 1) {
        undoneHistory.push(history.pop());
        const state = history[history.length - 1];
        components = [...state.components];
        wires = [...state.wires];
        redrawCanvas();
    }
}

function redo() {
    if (undoneHistory.length > 0) {
        const state = undoneHistory.pop();
        history.push(state);
        components = [...state.components];
        wires = [...state.wires];
        redrawCanvas();
    }
}

function redrawCanvas() {
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    components.forEach(renderComponent);
    wires.forEach(drawWire);
    checkBulbGlow();
}

// Enhanced logic: battery passes 1 (right) and 0 (left), bulb glows only if it receives both 1 and 0
function checkBulbGlow() {
    // Map: componentId -> signals received (array)
    const signals = {};
    // First, assign battery outputs
    components.forEach(comp => {
        if (comp.type === 'battery') {
            // Battery right terminal = 1, left terminal = 0
            signals[comp.id+':right'] = 1;
            signals[comp.id+':left'] = 0;
        }
    });
    // Propagate signals through wires
    wires.forEach(wire => {
        // Only propagate if both ends are connected
        if (wire.startComponent && wire.endComponent && wire.startTerminal && wire.endTerminal) {
            const fromKey = wire.startComponent + ':' + wire.startTerminal;
            const toKey = wire.endComponent + ':' + wire.endTerminal;
            if (signals[fromKey] !== undefined) {
                signals[toKey] = signals[fromKey];
            }
        }
    });
    // For each bulb, check if it receives both 1 and 0 (from any terminal)
    components.forEach(bulb => {
        if (bulb.type !== 'bulb') return;
        let received = [];
        // Check all wires connected to this bulb
        wires.forEach(wire => {
            if (wire.endComponent === bulb.id && wire.endTerminal) {
                const key = bulb.id + ':' + wire.endTerminal;
                if (signals[key] !== undefined) received.push(signals[key]);
            }
            if (wire.startComponent === bulb.id && wire.startTerminal) {
                const key = bulb.id + ':' + wire.startTerminal;
                if (signals[key] !== undefined) received.push(signals[key]);
            }
        });
        // Bulb glows only if it receives both 1 and 0
        const el = document.getElementById(`comp-${bulb.id}`);
        if (el) {
            if (received.includes(1) && received.includes(0)) {
                el.classList.add('powered');
            } else {
                el.classList.remove('powered');
            }
        }
    });
}

// Utility functions
function getComponentUnderCursor(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return components.find(component => {
        return x >= component.x && x <= component.x + 30 &&
               y >= component.y && y <= component.y + 30;
    });
}