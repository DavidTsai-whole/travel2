let xhr = new XMLHttpRequest();
xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true)
xhr.send(null)
xhr.onload = function () {
  let h2 = document.querySelector('.h2');
  let select = document.querySelector('.select');
  let hotLocal = document.querySelector('.hotLocal');
  let card = document.querySelector('.card');
  let str = '<option value="請選擇行政區" disabled selected>請選擇行政區</option ><option value="高雄旅遊景點">全部景點</option >';
  let datasm = JSON.parse(xhr.response).result.records;
  const pageid = document.querySelector('.pagination');
  let ad = [];

  all();


  let area = [];
  for (let i = 0; i < datasm.length; i++) {
    area.push(datasm[i].Zone)

  };

  let finalArea = [];
  area.forEach(function (item) {
    if (finalArea.indexOf(item) === -1) {
      finalArea.push(item);
    }
  });

  for (let i = 0; i < finalArea.length; i++) {
    str += '<option value="' + finalArea[i] + '">' + finalArea[i] + '</option>'
  };
  select.innerHTML = str;

  function all() {
    h2.textContent = '高雄旅遊景點'
    ad = [];
    datasm.forEach((item) => {
      ad.push(item);
    })
    pagination(ad, 1)
  }

  function cardList(e) {
    h2.textContent = e.target.value
    if (e.target.value !== '高雄旅遊景點') {
      ad = [];
      datasm.forEach((item) => {
        if (item.Zone === e.target.value) {
          ad.push(item);
        }
      })
    } else {
      ad = [];
      datasm.forEach((item) => {
        ad.push(item);
      })
    }
    pagination(ad, 1)


  }
  function displayData(perData) {
    let str = '';
    perData.forEach((item) => {
      str += '<li class="cardlist"><div class="photo"style="background-image:url(' + item.Picture1 + ')"><h4>' + item.Name + '</h4><p> ' + item.Zone + '</p></div><p>開放時間: ' + item.Opentime + '</p><p>地址: ' + item.Add + '</p><p>連絡電話: ' + item.Tel + '</p></li>'
    })
    card.innerHTML = str

  }
  function cardList2(e) {
    if (e.target.nodeName !== 'INPUT') {
      return;
    }
    h2.textContent = e.target.value;
    ad = [];
    datasm.forEach((item) => {
      if (item.Zone === e.target.value) {
        ad.push(item);
      }
    })
    pagination(ad, 1)

  }
  function pagination(data, nowPage) {
    const dataTotal = data.length;
    const perpage = 5;
    const pageTotal = Math.ceil(dataTotal / perpage);
    let currentPage = nowPage;
    if (currentPage > pageTotal) {
      currentPage = pageTotal;
    }
    const minData = (currentPage * perpage) - perpage + 1;
    const maxData = (currentPage * perpage);
    const perData = [];
    data.forEach((item, index) => {
      const num = index + 1;
      if (num >= minData && num <= maxData) {
        perData.push(item);
      }
    })
    const page = {
      pageTotal,
      currentPage,
      backPage: currentPage > 1,
      hasNext: currentPage < pageTotal,
    }
    displayData(perData);
    pageBtn(page);
  }

  function pageBtn(page) {
    let str = '';
    const total = page.pageTotal;
    if (page.backPage) {
      str += `<li class="pageList"><a href="#" data-page="${Number(page.currentPage) - 1}">Pre</a></li>`
    } else {
      str += `<li class="disabled">Pre</li>`
    }
    for (let i = 1; i <= total; i++) {
      if (Number(page.currentPage) === i) {
        str += `<li class="pageList active"><a href="#" data-page="${i}">${i}</a></li>`
        //如果i是6 active還在第一頁就不===了所以124行就不會出現
      } else if (Math.ceil(i / 5) === Math.ceil(page.currentPage / 5)) {
        str += `<li class="pageList"><a href="#" data-page="${i}">${i}</a></li>`
      }
    }
    if (page.hasNext) {
      str += `<li class="pageList"><a href="#" data-page="${Number(page.currentPage) + 1}">Next</a></li>`
    } else {
      str += `<li class="disabled">Next</li>`
    }
    pageid.innerHTML = str;
  }

  function switchPage(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A')
      return;
    const page = e.target.dataset.page;

    pagination(ad, page);
  }

  select.addEventListener('change', cardList);
  hotLocal.addEventListener('click', cardList2);
  pageid.addEventListener('click', switchPage);

}




