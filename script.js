    const wrapper=document.querySelector(".wrapper"),
    inputpart=wrapper.querySelector(".input-part"),
    infotxt=inputpart.querySelector(".info-txt"),
    inputfield=inputpart.querySelector("input"),
    locationbtn=inputpart.querySelector("button"),
    weatherpart = wrapper.querySelector(".weather-part"),
    wIcon = weatherpart.querySelector("img"),
    arrowBack=wrapper.querySelector("header i");
    let api;
    const apikey="3ab6163bd848252292697ddc45e78c52";
    locationbtn.addEventListener("click",()=>{
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
      }
      else{
        alert("Your browser does not support geolocation api");
      }
    });
    function onSuccess(position){
        const {latitude,longitude}=position.coords;
        api=`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
        fetchData();
        }
    function onError(error){
    infotxt.innerText=error.message;
    infotxt.classList.add("error");
    }
    inputfield.addEventListener("keyup",e=>{
    if(e.key=="Enter" && inputfield.value!=""){
    requestApi(inputfield.value);
    }
    });
    
    function requestApi(city){
        api=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
        fetchData();
    }
    function fetchData(){
        infotxt.innerText="Getting weather details...";
        infotxt.classList.add("pending");
        fetch(api).then(response => response.json()).then(result => weatherDetails(result)).catch(() =>{
        infotxt.innerText = "Something went wrong";
        infotxt.classList.replace("pending", "error");
    });
    }
    function weatherDetails(info){
        if(info.cod == "404"){
            infotxt.classList.replace("pending","error");
            infotxt.innerText= `${inputfield.value} isn't a valid city name`;
        }
        else{
            const city =info.name;
            const country =info.sys.country;
            const {description,id}=info.weather[0];
            const {feels_like,humidity,temp}=info.main;
            if(id==800){
                wIcon.src="icons/clear.svg";
            }
            else if(id>=200 && id<=232){
                wIcon.src="icons/storm.svg";
            }
            else if(id>=600 && id<=622){
                wIcon.src="icons/snow.svg";
            }
            else if(id>=801 && id<=804){
                wIcon.src="icons/cloud.svg";
            }
            else if((id>=300 && id<=321) || (id>=500 && id<=531)){
                wIcon.src="icons/rain.svg";
            }

            wrapper.querySelector(".temp .numb").innerText=Math.floor(temp);
            wrapper.querySelector(".weather").innerText=description;
            wrapper.querySelector(".location span").innerText=`${city},${country}`;
            wrapper.querySelector(".temp .numb-2").innerText=Math.floor(feels_like);
            wrapper.querySelector(".humidity span").innerText=`${humidity}`;
            infotxt.classList.remove("pending","error");
            infotxt.innerText="";
            inputfield.value="";
            wrapper.classList.add("active");
            console.log(info);
        }
    }
    arrowBack.addEventListener("click",()=>{
    wrapper.classList.remove("active");
    });
