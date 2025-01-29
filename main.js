const body = document.querySelector('body');
const appName = document.querySelector('.appnav-appName');
const appIcon = document.querySelector('.appnav-appIcon');
const searchbar = document.querySelector('.search-input');
const userProfile = document.querySelector('.user-profile');
const allLinks = document.querySelectorAll('.link');
const allaLinks = document.querySelectorAll('.link--link');
const userNumbers = document.querySelector('.user__numbers-box');
const userText = document.querySelectorAll('.user--text');

const colorModeText = document.querySelector('.appnav-appIcon--name');
const colorModeIcon = document.querySelector('.fa-solid');

//varialbes to change
const userName = document.querySelector('.user__data--name');
const userTag = document.querySelector('.user__data--tag');
const userJoinDate = document.querySelector('.user__data--joinDate');
const userDescription = document.querySelector('.user__description');
const repoQuantity = document.querySelector('.repo--number');
const followersQuantity = document.querySelector('.followers--number');
const followingQuantity = document.querySelector('.following--number');
const userCity = document.querySelector('.city');
const userTwitterAcc = document.querySelector('.twitterAcc');
const userBlogAcc = document.querySelector('.blogAcc');
const userCompany = document.querySelector('.company');
const userImg = document.querySelector('.userImg');
const errorMsg = document.querySelector('.errorMsg');

//btns
const colormodeBtn = document.querySelector('.appnav-appIcon');
const searchUserBtn = document.querySelector('.search-button');

async function getUserByUsername() {
	const username = searchbar.value || 'bartoszMokrzycki';
	const url = `https://api.github.com/users/${username}`;

	try {
		const response = await fetch(url, {
			headers: {
				Accept: 'application/vnd.github+json',
			},
		});

		if (!response.ok) {
			throw new Error(`Błąd: ${response.status}`);
		}

		const userData = await response.json();

		// User data
		userImg.setAttribute('src', userData.avatar_url);
		userName.textContent = userData.name;
		userTag.textContent = `@${userData.login}`;
		userTag.setAttribute('href', userData.html_url);

		const date = new Date(userData.created_at);
		const formattedDate = date.toISOString().split('T')[0];
		userJoinDate.textContent = `Joined ${formattedDate}`;

		// Bio
		userDescription.textContent = userData.bio || 'This profile has no bio';

		// Numbers
		repoQuantity.textContent = userData.public_repos;
		followersQuantity.textContent = userData.followers;
		followingQuantity.textContent = userData.following;

		// Additional info
		const setUserInfo = (element, value) => {
			element.textContent = value || 'Not Available';
			if (!value) {
				element.classList.add('unavailable');
				element.previousElementSibling.classList.add('unavailable');
				element.style.pointerEvents = 'none';
			} else {
				element.classList.remove('unavailable');
				element.previousElementSibling.classList.remove('unavailable');
				element.style.pointerEvents = 'all';
				if (element !== userCity && element !== userCompany) {
					element.setAttribute('href', value);
				}
			}
		};

		setUserInfo(userCity, userData.location);
		setUserInfo(userCompany, userData.company);
		setUserInfo(userBlogAcc, userData.blog);
		setUserInfo(userTwitterAcc, userData.twitter_username);

		searchbar.value = '';
		errorMsg.classList.add('hidden');
	} catch (error) {
		console.error('Błąd podczas pobierania danych użytkownika:', error);
		errorMsg.classList.remove('hidden');
	}
}

const colorModeItems = [
	body,
	appName,
	appIcon,
	searchbar,
	userProfile,
	...allLinks,
	...allaLinks,
	userNumbers,
	userDescription,
	...userText,
];

const handleColorMode = () => {
	colorModeItems.forEach(item => {
		item.classList.toggle('dark-mode');
	});

	if (body.classList.contains('dark-mode')) {
		colorModeText.textContent = 'light';
		colorModeIcon.classList.replace('fa-moon', 'fa-sun');
		appIcon.classList.add('light');
	} else {
		colorModeText.textContent = 'dark';
		colorModeIcon.classList.replace('fa-sun', 'fa-moon');
		appIcon.classList.remove('light');
	}
};

colormodeBtn.addEventListener('click', handleColorMode);
searchUserBtn.addEventListener('click', getUserByUsername);
document.addEventListener('DOMContentLoaded', getUserByUsername);

searchbar.addEventListener('keydown', event => {
	if (event.key === 'Enter' && searchbar.value.trim() !== '') {
		event.preventDefault();
		getUserByUsername();
	}
});
