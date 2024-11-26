import React from "react";
import "../assets/css/mainNav.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const MainNav = ({ targetId1, targetId2, targetId3 }) => {
  const handleClick = (event) => {
    event.preventDefault();
    const target = document.getElementById(targetId1);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };
  const handleClick2 = (event) => {
    event.preventDefault();
    const target = document.getElementById(targetId2);
    console.log(document);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
  const handleClick3 = (event) => {
    event.preventDefault();
    const target = document.getElementById(targetId3);
    console.log(document);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  const navigate = useNavigate();
  const handleRegister = () => {
    navigate("/registerPage");
  };
  const handleLogin = () => {
    navigate("/loginPage");
  }

  const [isVisible, setIsVisible] = useState(true);
  const [color, setColor] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;

      // Change color based on scroll position
      setColor(currentScrollY >= 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={`main-nav ${color ? "main-nav-bg" : ""} ${
        isVisible ? "visible" : "hidden"
      }`}
    >
      <div className="wandermate-logo">
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d="M23.0429 13.5485C22.8031 13.3412 22.5473 13.1687 22.2799 13.0338C22.2623 13.0261 22.2456 13.015 22.2305 13.0008C22.0266 13.495 21.8258 13.9892 21.6126 14.4792C21.2234 15.4016 20.8248 16.3159 20.4449 17.2424C20.1637 17.926 19.9073 18.6302 19.6324 19.3014C19.2122 20.3639 18.7828 21.4264 18.3596 22.4929C18.2607 22.74 18.165 22.9953 18.0692 23.2465L17.9858 23.2095C18.0445 22.7071 18.1125 22.2047 18.1619 21.7023C18.2113 21.1999 18.2298 20.7386 18.27 20.2568C18.3843 18.9185 18.511 17.5801 18.6191 16.2376C18.7488 14.6439 18.857 13.0502 18.9836 11.4566C19.0485 10.6329 19.1412 9.83405 19.2091 9.02279C19.2116 8.96844 19.2045 8.91409 19.1884 8.86405C19.1723 8.81401 19.1477 8.76966 19.1165 8.73453C18.8134 8.57489 18.504 8.43742 18.1897 8.32272C18.1422 8.31514 18.0941 8.32235 18.049 8.34379C18.004 8.36523 17.9633 8.4003 17.9302 8.44626C17.4328 9.30694 16.9478 10.18 16.4566 11.0448L15.5669 12.6261C15.0448 13.5526 14.5258 14.4874 14.0037 15.414C13.6948 15.9823 13.3673 16.5424 13.0522 17.1065L11.2882 20.2898C11.0967 20.6316 10.9113 20.9775 10.7167 21.3193C10.2842 22.0811 9.84863 22.8389 9.41613 23.5966C9.21533 23.9548 9.01762 24.3172 8.8199 24.6755C8.78357 24.7107 8.74537 24.7424 8.7056 24.7702C8.89713 24.0125 9.07322 23.3413 9.24313 22.6659C9.42849 21.9164 9.60767 21.1628 9.78994 20.4092L10.2564 18.5025C10.5901 17.1518 10.9227 15.8011 11.2543 14.4504C11.4087 13.8244 11.5611 13.1985 11.7115 12.5725C11.8999 11.8025 12.0914 11.0324 12.2768 10.2623C12.5085 9.2987 12.7309 8.33096 12.9657 7.37969C13.2746 6.07015 13.6052 4.76473 13.9234 3.4593C13.9883 3.18339 14.0222 2.89513 14.084 2.63569C14.1767 2.22389 14.2817 1.84503 14.393 1.45381C14.4362 1.29733 14.393 1.23556 14.2848 1.18614C13.9944 1.05436 13.7071 0.910229 13.4137 0.774334C13.3827 0.769508 13.3514 0.774038 13.322 0.787584C13.2926 0.801131 13.2658 0.823346 13.2437 0.852578C13.1447 1.03117 13.0529 1.21675 12.9688 1.40851C12.7186 1.94386 12.49 2.49568 12.2212 3.01455C11.8443 3.73521 11.4427 4.43528 11.0442 5.13535C10.5746 5.95896 10.1174 6.78257 9.61076 7.56088C9.05469 8.4545 8.48935 9.33576 7.89312 10.18C7.29689 11.0242 6.65741 11.7942 6.03955 12.5973C5.77696 12.9432 5.52982 13.3097 5.24869 13.6268C4.6988 14.2486 4.13655 14.8622 3.56504 15.4428C2.99352 16.0235 2.3942 16.6124 1.79179 17.1683C1.2419 17.6707 0.670379 18.136 0.105041 18.6137C-0.0123515 18.7126 -0.0308873 18.8032 0.049434 18.9473C0.208415 19.2113 0.356904 19.4862 0.49429 19.7709C0.583879 19.9686 0.676557 19.9768 0.803218 19.8697C1.49831 19.2685 2.19648 18.6755 2.8823 18.0537C3.34261 17.6419 3.79055 17.193 4.23232 16.74C4.85017 16.1058 5.46803 15.4634 6.06426 14.8004C6.43189 14.3886 6.78407 13.9521 7.13006 13.5073C7.74792 12.7332 8.36578 11.9631 8.92803 11.1477C9.57677 10.2335 10.1946 9.26987 10.8125 8.31037C11.0658 7.89856 11.2882 7.48676 11.5261 7.07495C11.5768 6.99981 11.6316 6.92963 11.6898 6.86493C11.6771 6.98022 11.6521 7.09253 11.6157 7.19849C11.4303 7.93974 11.2543 8.68099 11.072 9.42636C10.7528 10.7112 10.4356 11.9988 10.1205 13.2891C9.94749 13.9837 9.77758 14.6824 9.61076 15.3852C9.3976 16.2664 9.18752 17.1518 8.97128 18.0372C8.68088 19.2397 8.37504 20.4339 8.08774 21.6364C7.8684 22.5465 7.67069 23.4648 7.46989 24.379C7.29071 25.1408 7.10226 25.9027 6.92308 26.6604C6.86439 26.9116 6.81187 27.1628 6.75317 27.4099C6.60489 28.0194 6.44424 28.6453 6.31141 29.2383C6.30817 29.2826 6.31325 29.3272 6.32619 29.3682C6.33914 29.4092 6.35954 29.4452 6.38555 29.473C6.6574 29.6501 6.93544 29.8025 7.2073 29.9672C7.32469 30.0372 7.39265 29.996 7.46679 29.856C7.72629 29.3866 7.99506 28.9294 8.26383 28.4641C8.76738 27.5911 9.27711 26.7222 9.77758 25.845C10.102 25.2809 10.4201 24.7043 10.7414 24.1319L12.2861 21.414C12.7742 20.5451 13.2654 19.6803 13.7504 18.8073C14.1891 18.0166 14.6216 17.2177 15.0572 16.4229C15.2394 16.0935 15.4248 15.7682 15.6101 15.4428C16.0056 14.751 16.4072 14.0592 16.7995 13.3632C17.0559 12.9102 17.3 12.449 17.5502 11.9919C17.5912 11.9424 17.6357 11.8982 17.683 11.8601C17.646 12.0825 17.6151 12.2225 17.6027 12.3708C17.4266 14.4874 17.2567 16.6041 17.0806 18.7208C16.92 20.6851 16.7501 22.6412 16.5894 24.6014C16.5029 25.6762 16.4257 26.751 16.3361 27.8258C16.3239 27.8718 16.32 27.9211 16.3249 27.9695C16.3297 28.0179 16.343 28.0641 16.3638 28.1042C16.3846 28.1444 16.4123 28.1775 16.4445 28.2007C16.4768 28.2238 16.5127 28.2365 16.5493 28.2376C16.8026 28.3076 17.0528 28.3859 17.3031 28.4847C17.3419 28.5049 17.3835 28.5144 17.4252 28.5126C17.4669 28.5108 17.5078 28.4978 17.5457 28.4743C17.5835 28.4509 17.6173 28.4174 17.6452 28.376C17.6731 28.3346 17.6943 28.2861 17.7078 28.2335C18.0167 27.4428 18.3565 26.6522 18.6871 25.8697C19.0176 25.0873 19.3605 24.2678 19.7034 23.4689C20.0463 22.67 20.3738 21.9082 20.7105 21.1299C21.0473 20.3515 21.3562 19.6515 21.6837 18.9185C22.0111 18.1855 22.3417 17.4566 22.6722 16.7235C23.0841 15.834 23.4847 14.9418 23.874 14.0468C23.5834 13.9241 23.3046 13.7569 23.0429 13.5485Z"
              fill="white"
            />
            <path
              d="M29.9999 0C29.8953 0.0281836 29.7921 0.0653215 29.691 0.111186C29.413 0.259436 29.138 0.415923 28.8631 0.580645C28.2246 0.96063 27.6688 1.54999 27.2474 2.29375C26.8705 2.95676 26.5677 3.69389 26.2372 4.4022C26.024 4.8593 25.8201 5.32464 25.6008 5.77763C25.5486 5.87166 25.4711 5.93512 25.3846 5.9547C24.5288 6.11942 23.67 6.27179 22.8143 6.43651C22.113 6.57241 21.4179 6.71654 20.7197 6.87303C20.6196 6.89779 20.5284 6.96581 20.4602 7.06658C20.2409 7.4372 20.0401 7.82841 19.8424 8.21551C19.7806 8.33493 19.8424 8.40906 19.9289 8.4173C20.0154 8.42553 20.0957 8.4173 20.1791 8.4173H24.0407H24.3218C24.2904 8.52968 24.2543 8.63967 24.2137 8.74674C23.8152 9.6733 23.4167 10.5999 23.0089 11.5182C22.9548 11.6122 22.8768 11.6767 22.7896 11.6994C22.3484 11.8448 21.9019 11.9602 21.4519 12.0453C21.25 12.0569 21.055 12.1463 20.8905 12.3028C20.726 12.4592 20.5991 12.6759 20.5251 12.9266C20.4386 13.1901 20.451 13.2601 20.6703 13.2684L21.8257 13.3054C21.94 13.3054 22.0574 13.326 22.1872 13.3425C22.1854 13.352 22.1854 13.3618 22.1872 13.3713C22.1872 13.3713 22.1872 13.3713 22.2026 13.3713C22.4814 13.505 22.747 13.6833 22.9935 13.9025L23.4012 14.1743C23.5315 14.2719 23.6721 14.3427 23.8183 14.3844C23.8453 14.3897 23.8697 14.4089 23.8863 14.4379C23.9233 14.4379 23.9635 14.4873 24.0191 14.5944C24.1766 14.895 24.328 15.1956 24.501 15.5003C24.5628 15.6198 24.6215 15.6486 24.6926 15.5003C24.8069 15.278 24.9304 15.0638 25.0324 14.8373C25.0766 14.7428 25.0952 14.6308 25.0849 14.5202C25.0493 14.2742 24.9912 14.035 24.9119 13.8078C24.6987 13.2231 24.5134 12.6589 24.9706 12.1235C24.9706 12.1235 24.9706 12.0906 24.9922 12.0741C25.2672 11.4523 25.539 10.8387 25.8201 10.2086C25.9154 10.0185 26.0185 9.83568 26.1291 9.66095L28.0661 12.9142L28.8754 11.6788C28.8877 11.6378 28.8877 11.5921 28.8754 11.5511C28.6839 10.9334 28.4862 10.3157 28.3008 9.70625C28.0413 8.84146 27.7911 7.97666 27.5501 7.10364C27.518 6.9592 27.5302 6.80367 27.5841 6.67124C27.8127 6.16884 28.0599 5.68703 28.307 5.2011C28.4769 4.8593 28.6499 4.52574 28.826 4.19218C29.0691 3.77642 29.292 3.34039 29.4933 2.88675C29.8045 2.08269 29.9845 1.19993 30.0216 0.296499C30.003 0.226492 29.9999 0.131778 29.9999 0ZM24.2662 10.5175L24.2045 10.4516C25.0322 8.18262 26.0114 6.01742 27.13 3.98215L27.1825 4.01922L24.2662 10.5175Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_48_65">
              <rect width="30" height="30" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div className="nav">
        <a
          href={`#${targetId1}`}
          className="nav-link about"
          onClick={handleClick}
        >
          About
        </a>
        <a href={`#${targetId2}`} className="nav-link explore" onClick={handleClick2}>
          Process
        </a>
        <a href={`#${targetId3}`} className="nav-link explore" onClick={handleClick3}>
          Explore
        </a>
      </div>
      <div className="startGroup">
        <Button variant="outline" size="xs" style={{ left: "88%" }} onClick={handleLogin}>
          Login
        </Button>
        <Button size="xs" style={{ left: "82.5%" }} onClick={handleRegister}>
          Signup
        </Button>

        {/* <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.25563 21.6963C13.5338 21.0713 16.4794 21.125 20.7631 21.7181C21.0734 21.7631 21.3568 21.9188 21.5612 22.1565C21.7656 22.3942 21.877 22.6978 21.875 23.0113C21.875 23.3113 21.7719 23.6025 21.5856 23.83C21.261 24.2266 20.9284 24.6167 20.5881 25H22.2388C22.3425 24.8763 22.4469 24.75 22.5525 24.6219C22.9232 24.1673 23.1255 23.5985 23.125 23.0119C23.125 21.7463 22.2012 20.6556 20.9344 20.4806C16.5494 19.8738 13.4844 19.8156 9.075 20.46C7.795 20.6469 6.875 21.7544 6.875 23.0288C6.875 23.5944 7.05938 24.1538 7.40875 24.6069C7.51188 24.7406 7.61375 24.8719 7.715 25.0006H9.32562C9.00901 24.6216 8.7002 24.2361 8.39938 23.8444C8.2206 23.6099 8.12416 23.323 8.125 23.0281C8.125 22.355 8.60875 21.7906 9.25563 21.6963ZM15 15.625C15.4925 15.625 15.9801 15.528 16.4351 15.3395C16.89 15.1511 17.3034 14.8749 17.6517 14.5267C17.9999 14.1784 18.2761 13.765 18.4645 13.3101C18.653 12.8551 18.75 12.3675 18.75 11.875C18.75 11.3825 18.653 10.8949 18.4645 10.4399C18.2761 9.98497 17.9999 9.57157 17.6517 9.22335C17.3034 8.87513 16.89 8.59891 16.4351 8.41045C15.9801 8.222 15.4925 8.125 15 8.125C14.0054 8.125 13.0516 8.52009 12.3483 9.22335C11.6451 9.92661 11.25 10.8804 11.25 11.875C11.25 12.8696 11.6451 13.8234 12.3483 14.5267C13.0516 15.2299 14.0054 15.625 15 15.625ZM15 16.875C16.3261 16.875 17.5979 16.3482 18.5355 15.4105C19.4732 14.4729 20 13.2011 20 11.875C20 10.5489 19.4732 9.27715 18.5355 8.33947C17.5979 7.40178 16.3261 6.875 15 6.875C13.6739 6.875 12.4021 7.40178 11.4645 8.33947C10.5268 9.27715 10 10.5489 10 11.875C10 13.2011 10.5268 14.4729 11.4645 15.4105C12.4021 16.3482 13.6739 16.875 15 16.875Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 26.25C21.2131 26.25 26.25 21.2131 26.25 15C26.25 8.78687 21.2131 3.75 15 3.75C8.78687 3.75 3.75 8.78687 3.75 15C3.75 21.2131 8.78687 26.25 15 26.25ZM15 27.5C21.9037 27.5 27.5 21.9037 27.5 15C27.5 8.09625 21.9037 2.5 15 2.5C8.09625 2.5 2.5 8.09625 2.5 15C2.5 21.9037 8.09625 27.5 15 27.5Z"
            fill="white"
          />
        </svg> */}
      </div>
    </div>
  );
};

export default MainNav;
