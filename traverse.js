var originElement;
var xpathArray;
var gridArray = [];
var iframeStack = [];
var DOMSet;
var colorCode = 'gray';
var type = 0;
var cluster = [];

var count = 0;

function showAllClusters(root) {
    let nodes = [[root]];

    while (nodes.length) {
        console.log(nodes);
        let cluster = nodes.pop();
        console.log(cluster);
        let partitions = {};
        for (let node of cluster) { // foreach node in existing cluster
            for (const child of node.children) { // get their children and partition them by tagname
                if (child.tagName === "SCRIPT" || child.tagName === "STYLE")
                    continue;
                if (child.tagName in partitions) {
                    partitions[child.tagName].push(child);
                } else {
                    partitions[child.tagName] = [child];
                }
            }
        }

        console.log(partitions);
        let result = [];
        for (let key in partitions) { // create coverbox foreach partition
            console.log(partitions[key])
            nodes.push([...partitions[key]]);
            if (partitions[key].length > 1) {
                colorCode = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
                originElement = partitions[key].pop();
                gridArray = [originElement.getBoundingClientRect()];
                for (let element of partitions[key]) {
                    if (checkCluster(element)) {
                        result.push(element);
                    }
                }
            }
        }

        if (result.length > 1)
            result.forEach(e => createCoverBox(e, 0));
    }
}

function checkCluster(node) {
    const isSame = false;
    const nodeRect = node.getBoundingClientRect();

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

function removeCoverBox() {
    document.querySelectorAll('.sideexCoverageElement').forEach(e => e.remove());
}

showAllClusters(document.querySelectorAll('body')[0]);
