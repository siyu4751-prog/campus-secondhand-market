const defaultProducts = [
    {
        id: 1,
        name: "二手高等数学教材",
        price: 15,
        category: "教材资料",
        condition: "八成新",
        contact: "微信：student001",
        desc: "适合大一高数课程使用，书内有少量笔记。",
        sold: false
    },
    {
        id: 2,
        name: "蓝牙耳机",
        price: 59,
        category: "数码产品",
        condition: "九成新",
        contact: "QQ：123456789",
        desc: "音质正常，续航良好，因换新耳机所以转让。",
        sold: false
    },
    {
        id: 3,
        name: "宿舍折叠椅",
        price: 25,
        category: "生活用品",
        condition: "七成新",
        contact: "电话：13800000000",
        desc: "适合宿舍、自习室使用，轻便可折叠。",
        sold: true
    },
    {
        id: 4,
        name: "篮球",
        price: 35,
        category: "运动器材",
        condition: "八成新",
        contact: "微信：basketball888",
        desc: "室外篮球场使用过，弹性正常，适合日常运动。",
        sold: false
    }
];

let savedProducts = JSON.parse(localStorage.getItem("products"));

let products = savedProducts || defaultProducts;

// 兼容旧版本数据，给旧商品补充 id 和 sold 字段
products = products.map((product, index) => {
    return {
        id: product.id || Date.now() + index,
        name: product.name,
        price: product.price,
        category: product.category,
        condition: product.condition,
        contact: product.contact,
        desc: product.desc,
        sold: product.sold || false
    };
});

saveProducts();

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function getCategoryIcon(category) {
    if (category === "教材资料") {
        return "📚";
    } else if (category === "数码产品") {
        return "💻";
    } else if (category === "生活用品") {
        return "🧴";
    } else if (category === "服装鞋包") {
        return "👕";
    } else if (category === "运动器材") {
        return "🏀";
    } else {
        return "📦";
    }
}

function updateStats() {
    const totalCount = products.length;
    const soldCount = products.filter(product => product.sold).length;
    const availableCount = totalCount - soldCount;

    document.getElementById("totalCount").innerText = totalCount;
    document.getElementById("availableCount").innerText = availableCount;
    document.getElementById("soldCount").innerText = soldCount;
}

function renderProducts() {
    const productList = document.getElementById("productList");
    const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
    const selectedCategory = document.getElementById("categoryFilter").value;
    const selectedStatus = document.getElementById("statusFilter").value;

    productList.innerHTML = "";

    const filteredProducts = products.filter(product => {
        const matchSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.desc.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        const matchCategory =
            selectedCategory === "全部" || product.category === selectedCategory;

        const productStatus = product.sold ? "已售出" : "出售中";
        const matchStatus =
            selectedStatus === "全部" || selectedStatus === productStatus;

        return matchSearch && matchCategory && matchStatus;
    });

    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p class="empty-text">暂无符合条件的商品。</p>';
        updateStats();
        return;
    }

    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = product.sold ? "product-card sold" : "product-card";

        const statusText = product.sold ? "已售出" : "出售中";
        const statusClass = product.sold ? "sold" : "available";
        const soldButtonText = product.sold ? "恢复出售" : "标记售出";

        card.innerHTML = `
            <div class="product-icon">${getCategoryIcon(product.category)}</div>
            <h3>${product.name}</h3>
            <div class="price">￥${product.price}</div>
            <span class="tag">${product.category}</span>
            <span class="status ${statusClass}">${statusText}</span>
            <p><strong>新旧程度：</strong>${product.condition}</p>
            <p><strong>联系方式：</strong>${product.contact}</p>
            <p><strong>商品描述：</strong>${product.desc}</p>
            <div class="card-actions">
                <button class="sold-btn" onclick="toggleSold(${product.id})">${soldButtonText}</button>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">删除</button>
            </div>
        `;

        productList.appendChild(card);
    });

    updateStats();
}

function addProduct() {
    const name = document.getElementById("nameInput").value.trim();
    const price = document.getElementById("priceInput").value.trim();
    const category = document.getElementById("categoryInput").value;
    const condition = document.getElementById("conditionInput").value.trim();
    const contact = document.getElementById("contactInput").value.trim();
    const desc = document.getElementById("descInput").value.trim();

    if (name === "" || price === "" || condition === "" || contact === "" || desc === "") {
        alert("请把商品信息填写完整！");
        return;
    }

    if (Number(price) <= 0) {
        alert("商品价格必须大于 0！");
        return;
    }

    const newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        category: category,
        condition: condition,
        contact: contact,
        desc: desc,
        sold: false
    };

    products.unshift(newProduct);
    saveProducts();
    renderProducts();

    document.getElementById("nameInput").value = "";
    document.getElementById("priceInput").value = "";
    document.getElementById("conditionInput").value = "";
    document.getElementById("contactInput").value = "";
    document.getElementById("descInput").value = "";

    alert("商品发布成功！");
}

function toggleSold(id) {
    products = products.map(product => {
        if (product.id === id) {
            product.sold = !product.sold;
        }
        return product;
    });

    saveProducts();
    renderProducts();
}

function deleteProduct(id) {
    if (confirm("确定要删除这个商品吗？")) {
        products = products.filter(product => product.id !== id);
        saveProducts();
        renderProducts();
    }
}

function clearAllProducts() {
    if (confirm("确定要清空全部商品吗？这个操作不能撤销。")) {
        products = [];
        saveProducts();
        renderProducts();
    }
}

document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);
document.getElementById("statusFilter").addEventListener("change", renderProducts);

renderProducts();
