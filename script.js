let products = JSON.parse(localStorage.getItem("products")) || [
    {
        name: "二手高等数学教材",
        price: 15,
        category: "教材资料",
        condition: "八成新",
        contact: "微信：student001",
        desc: "适合大一高数课程使用，书内有少量笔记。"
    },
    {
        name: "蓝牙耳机",
        price: 59,
        category: "数码产品",
        condition: "九成新",
        contact: "QQ：123456789",
        desc: "音质正常，续航良好，因换新耳机所以转让。"
    },
    {
        name: "宿舍折叠椅",
        price: 25,
        category: "生活用品",
        condition: "七成新",
        contact: "电话：13800000000",
        desc: "适合宿舍、自习室使用，轻便可折叠。"
    }
];

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function renderProducts() {
    const productList = document.getElementById("productList");
    const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
    const selectedCategory = document.getElementById("categoryFilter").value;

    productList.innerHTML = "";

    const filteredProducts = products.filter(product => {
        const matchSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.desc.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        const matchCategory =
            selectedCategory === "全部" || product.category === selectedCategory;

        return matchSearch && matchCategory;
    });

    if (filteredProducts.length === 0) {
        productList.innerHTML = "<p>暂无符合条件的商品。</p>";
        return;
    }

    filteredProducts.forEach((product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <h3>${product.name}</h3>
            <div class="price">￥${product.price}</div>
            <span class="tag">${product.category}</span>
            <p><strong>新旧程度：</strong>${product.condition}</p>
            <p><strong>联系方式：</strong>${product.contact}</p>
            <p><strong>商品描述：</strong>${product.desc}</p>
            <button class="delete-btn" onclick="deleteProduct(${index})">删除商品</button>
        `;

        productList.appendChild(card);
    });
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

    const newProduct = {
        name: name,
        price: price,
        category: category,
        condition: condition,
        contact: contact,
        desc: desc
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

function deleteProduct(index) {
    if (confirm("确定要删除这个商品吗？")) {
        products.splice(index, 1);
        saveProducts();
        renderProducts();
    }
}

document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);

renderProducts();
