var originElement;
var xpathArray;
var gridArray = [];
var iframeStack = [];
var DOMSet;
var colorCode;
var colorCode = 'gray';
var type = 0;
var cluster = [];

function removeCoverBox() {
    document.querySelectorAll('.sideexCoverageElement').forEach(e => e.remove());
}

function showAllClusters(nodeList) {
    if (nodeList) {
        DOMSet = new Set(nodeList);
    } else {
        DOMSet = new Set(Array.from(document.querySelectorAll('body *')));
        iframeStack = [];
    }

    while (DOMSet.size > 0) {
        gridArray = [];
        console.log(DOMSet.size);
        const first = DOMSet.values().next().value;
        const parentRect = first.parentElement.getBoundingClientRect();
        const nodeRect = first.getBoundingClientRect();
        // if (parentRect.width * parentRect.height > nodeRect.width * nodeRect.height * 2) createClusterByBaseElement(first);
        createClusterByBaseElement(first);
        colorCode = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        DOMSet.delete(first);
    }

    if (iframeStack.length) {
        showAllClusters(Array.from(iframeStack.pop().contentWindow.document.querySelectorAll('body *')));
    }
}

function createClusterByBaseElement(baseElement) {
    cluster = [baseElement];
    originElement = baseElement;
    gridArray.push(originElement.getBoundingClientRect());
    // createCoverBox(baseElement, 0);
    let depth = 0;
    xpathArray = [baseElement];

    while (baseElement.parentElement) {
        depth++;
        const nodes = baseElement.parentElement.children;
        for (const node of nodes) {
            if (node !== baseElement) {
                deepSearch(node, depth - 1);
            }
        }
        baseElement = baseElement.parentElement;
        xpathArray.push(baseElement);
    }

    if (cluster.length > 0)
        cluster.forEach(e => createCoverBox(e, 0));
}

function createCoverBox(element, type) {
    const safePadding = 30;
    const box = document.createElement("sideex-show-element");
    let isWindowMove = false;
    let r = element.getBoundingClientRect();
    // check if element is in a safe range

    if (r.width <= window.innerWidth - 2 * safePadding) {
        if (r.left <= safePadding) {
            // window.scrollBy(r.left - safePadding, 0);
            isWindowMove = true;
        } else if (r.right >= window.innerWidth - safePadding) {
            // window.scrollBy(r.right - window.innerWidth + safePadding, 0);
            isWindowMove = true;
        }
    }
    if (r.height <= window.innerHeight - 2 * safePadding) {
        if (r.top <= safePadding) {
            // window.scrollBy(0, r.top - safePadding);
            isWindowMove = true;
        } else if (r.bottom >= window.innerHeight - safePadding) {
            // window.scrollBy(0, r.bottom - window.innerHeight + safePadding);
            isWindowMove = true;
        }
    }
    if (isWindowMove) {
        r = element.getBoundingClientRect();
    }
    box.style.display = "block";
    box.style.position = "fixed";
    box.style.outlineOffset = "10px";
    box.style.zIndex = "2147483647";
    box.style.top = `${r.top}px`;
    box.style.left = `${r.left}px`;
    box.style.width = `${r.width}px`;
    box.style.height = `${r.height}px`;
    box.style.pointerEvents = 'none';
    box.classList.add("sideexCoverageElement");
    switch (type) {
        case 0:
            box.style.border = colorCode + " solid 3px";
            box.style.borderRadius = "16px";
            // box.style.backgroundColor = "gray";
            box.style.opacity = "1";
            break;
        case 1:
            box.style.border = colorCode + " solid 3px";
            box.style.borderRadius = "16px";
            // box.style.backgroundColor = "gray";
            box.style.opacity = "1";
            break;
    }

    document.body.appendChild(box);
}

function deepSearch(node, depth) {
    if (node.tagName === "IFRAME" && iframeStack.indexOf(node) === -1) {
        iframeStack.push(node);
    }
    if (xpathArray[depth].tagName !== node.tagName) {
        return;
    }
    if (depth == 0 && checkCluster(node, depth)) {
        // createCoverBox(node, 0);
        cluster.push(node);
        DOMSet.delete(node);

        return;
    }

    const nodes = node.children;
    if (nodes.length !== 0 && depth > 0) {
        for (const n of nodes) {
            deepSearch(n, depth - 1);
        }
    }
}

function checkCluster(node, depth) {
    const isSame = false;
    const nodeRect = node.getBoundingClientRect();

    // DOM left tagneme
    if (node.tagName !== originElement.tagName) {
        return false;
    }

    if (nodeRect.width === 0 && nodeRect.height === 0) {
        return false;
    }

    for (const rect of gridArray) {
        // coordination horizontal alignment
        if ((rect.y === nodeRect.y) ||
            (rect.y + rect.height === nodeRect.y + nodeRect.height) ||
            (Math.abs((rect.y + rect.height / 2) - (nodeRect.y + nodeRect.height / 2)) < 0.5)) {
            gridArray.push(nodeRect);
            return true;
        }

        // coordination vertical alignment
        if ((rect.x === nodeRect.x) ||
            (rect.x + rect.width === nodeRect.x + nodeRect.width) ||
            (Math.abs((rect.x + rect.width / 2) - (nodeRect.x + nodeRect.width / 2)) < 0.5)) {
            gridArray.push(nodeRect);
            return true;
        }
    }

    return isSame;
}

removeCoverBox();
