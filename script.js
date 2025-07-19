// 健康寿命データ（厚生労働省データに基づく）
const HEALTH_LONGEVITY_MALE = 72.57;
const HEALTH_LONGEVITY_FEMALE = 75.45;

// アドバイスデータベース（40代以上向けのユーモアを含む）
const advice = {
    spicy: [
        "動けなくなってからじゃ遅いんだよ！健康こそが最強の資産だ。今すぐ行動しろ！",
        "まだ若いからって油断してんじゃねーぞ。健康は貯金と同じ。今から積立ないと、老後がマジでヤバい。",
        "時間は待ってくれない。今この瞬間から生活習慣を見直せ！明日やろうは馬鹿野郎だ！",
        "健康寿命が過ぎてから後悔しても遅い。今すぐ運動しろ、野菜を食え、酒を控えろ！",
        "甘い考えは捨てろ。あなたの体は消耗品だ。メンテナンスを怠れば確実に壊れる。",
        "現実を見ろ！このカウンターが示しているのは、あなたに残された猶予時間だ。無駄にするな！",
        "「忙しい」なんて言い訳は通用しない。健康管理も仕事のうちだ。プロなら体調管理も完璧にしろ！",
        "年齢を重ねるほど回復力は落ちる。今のうちに貯金ならぬ「健康の貯筋」をしておけ！"
    ],
    medium: [
        "あなたの健康寿命は有限です。後で後悔しないように、今できることから始めてみませんか？",
        "忙しい毎日かもしれませんが、少しの時間でも運動や食事に気を配ることが、未来のあなたを助けます。",
        "健康は一日にして成らず。小さな積み重ねが、長期的な健康につながります。",
        "定期的な健康チェックと適度な運動が、あなたの健康寿命を延ばす鍵となるでしょう。",
        "バランスの取れた食事と十分な睡眠。基本的なことですが、これが健康の土台です。",
        "ストレス管理も大切な健康要素です。リラックスする時間を意識的に作ってみてください。",
        "40代は人生の折り返し地点。これからの人生をより豊かにするため、今から健康投資を始めましょう。",
        "昔と同じような生活では、体がついてこないかもしれません。年齢に合わせた健康管理を心がけましょう。"
    ],
    sweet: [
        "あなたは健康に恵まれています。この素晴らしい状態をこれからも大切にしていきましょうね。",
        "毎日頑張っているあなたへ。たまには自分の体を労わって、心と体を休ませてあげてください。",
        "健康でいられることに感謝しながら、今日も一歩ずつ歩んでいきましょう。",
        "あなたの笑顔が周りの人を幸せにしています。その笑顔を保つためにも、健康を大切に。",
        "無理をせず、自分のペースで健康的な生活を続けてくださいね。あなたならきっとできます。",
        "今日という日を大切に過ごしてください。あなたの健康と幸せを心から願っています。",
        "人生経験豊富なあなたなら、きっと賢い健康管理ができるはず。ゆっくりでも着実に進んでいきましょう。",
        "これまでたくさんのことを乗り越えてきたあなた。健康管理も、きっと上手にできますよ。"
    ]
};

// よくある言い訳データベース（40代以上向けのユーモア）
const excuses = [
    "「明日から本気出す」…それ、何回目でしたっけ？",
    "「もう歳だし」…そんなこと言ってたら、あっという間ですよ！",
    "「三日坊主は才能」…諦めるのは、まだ早いですよ？",
    "「時間がない」…でも、スマホを見る時間はあるんですよね？",
    "「運動は苦手」…でも若い頃は体育の授業、サボってませんでしたよね？",
    "「お金がかかる」…でも、病院代の方がもっとかかりますよ？",
    "「続かない」…でも、朝のコーヒーは毎日続いてますよね？",
    "「疲れてる」…でも、週末のお酒は元気に飲んでません？",
    "「面倒くさい」…でも、髪の毛のセットには時間かけてますよね？",
    "「効果が見えない」…でも、体重計に乗るのは怖がってません？"
];

// グローバル変数
let countdownInterval;
let targetDate;
let selectedTone = 'medium';
let currentAdviceIndex = 0;

// DOM要素の取得
const form = document.getElementById('countdown-form');
const resultsSection = document.getElementById('results-section');
const countdownElement = document.getElementById('countdown');
const adviceText = document.getElementById('advice-text');
const resultMessage = document.getElementById('result-message');
const randomExcuse = document.getElementById('random-excuse');
const newAdviceBtn = document.getElementById('new-advice-btn');
const scrollToFormBtn = document.querySelector('.scroll-to-form-btn');

// 年齢計算関数
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// 健康寿命終了日の計算
function calculateHealthLifeEndDate(birthDate, gender) {
    const birth = new Date(birthDate);
    const healthLifeYears = gender === 'male' ? HEALTH_LONGEVITY_MALE : HEALTH_LONGEVITY_FEMALE;
    
    // 健康寿命終了日を計算
    const endDate = new Date(birth);
    endDate.setFullYear(birth.getFullYear() + Math.floor(healthLifeYears));
    
    // 小数点部分を日数として加算
    const remainingDays = Math.floor((healthLifeYears % 1) * 365.25);
    endDate.setDate(endDate.getDate() + remainingDays);
    
    return endDate;
}

// 時間差の計算
function calculateTimeDifference(targetDate) {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff <= 0) {
        return null; // 健康寿命を超過
    }
    
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { years, days, hours, minutes, seconds };
}

// カウントダウン表示の更新
function updateCountdown() {
    const timeDiff = calculateTimeDifference(targetDate);
    
    if (!timeDiff) {
        // 健康寿命を超過している場合
        countdownElement.innerHTML = `
            <div class="exceeded-message" style="grid-column: 1 / -1; padding: 2rem; background: var(--white); border-radius: 15px; text-align: center;">
                <h3 style="color: var(--accent-terracotta); margin-bottom: 1rem; font-family: var(--font-serif);">
                    あなたの健康寿命はすでに過ぎています
                </h3>
                <p style="color: var(--text-medium); font-size: 1.1rem;">
                    今日という一日を大切に、心穏やかにお過ごしください。<br>
                    でも、まだまだ元気でいられる可能性は十分にあります！
                </p>
            </div>
        `;
        clearInterval(countdownInterval);
        
        // 超過時のメッセージ
        resultMessage.textContent = "健康寿命を超えても、まだまだ人生は続きます。今日を大切に過ごしましょう。";
        return;
    }
    
    // 各時間単位を更新
    const yearsEl = document.getElementById('years');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (yearsEl) yearsEl.textContent = String(timeDiff.years).padStart(2, '0');
    if (daysEl) daysEl.textContent = String(timeDiff.days).padStart(3, '0');
    if (hoursEl) hoursEl.textContent = String(timeDiff.hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(timeDiff.minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(timeDiff.seconds).padStart(2, '0');
    
    // 秒が更新される時にpulseアニメーションを追加
    if (secondsEl) {
        secondsEl.parentElement.classList.add('pulse');
        setTimeout(() => {
            secondsEl.parentElement.classList.remove('pulse');
        }, 100);
    }
}

// ランダムなアドバイスを取得
function getRandomAdvice(tone) {
    const advices = advice[tone];
    const randomIndex = Math.floor(Math.random() * advices.length);
    return advices[randomIndex];
}

// アドバイスの表示
function displayAdvice() {
    const newAdvice = getRandomAdvice(selectedTone);
    adviceText.textContent = newAdvice;
    adviceText.classList.add('fade-in');
    setTimeout(() => adviceText.classList.remove('fade-in'), 600);
}

// ランダムな言い訳を表示
function displayRandomExcuse() {
    const randomIndex = Math.floor(Math.random() * excuses.length);
    randomExcuse.textContent = excuses[randomIndex];
}

// スムーズスクロール
function scrollToForm() {
    document.getElementById('form-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// 結果に応じたメッセージを生成
function generateResultMessage(years, days) {
    if (years > 30) {
        return "まだまだ時間はたっぷり！でも油断は禁物ですよ。";
    } else if (years > 20) {
        return "そろそろ健康に気を使い始める良いタイミングかもしれませんね。";
    } else if (years > 10) {
        return "健康管理を本格的に始める時期が来ました。";
    } else if (years > 5) {
        return "今が健康への投資を真剣に考える時です。";
    } else {
        return "一日一日を大切に、健康的に過ごしましょう。";
    }
}

// SNS共有機能
function setupSocialShare() {
    const twitterBtn = document.getElementById('share-twitter');
    const facebookBtn = document.getElementById('share-facebook');
    const lineBtn = document.getElementById('share-line');
    
    const shareText = "私の健康寿命をチェックしました！あなたも確認してみませんか？";
    const shareUrl = window.location.href;
    
    if (twitterBtn) {
        twitterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
        });
    }
    
    if (lineBtn) {
        lineBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
            window.open(lineUrl, '_blank', 'width=600,height=400');
        });
    }
}

// フォーム送信の処理
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(form);
    const birthDate = formData.get('dob');
    const gender = formData.get('gender');
    const tone = formData.get('advice-tone');
    
    // デバッグログ
    console.log('フォーム送信データ:', {
        birthDate: birthDate,
        gender: gender,
        tone: tone
    });
    
    if (!birthDate || !gender || !tone) {
        let missingFields = [];
        if (!birthDate) missingFields.push('生年月日');
        if (!gender) missingFields.push('性別');
        if (!tone) missingFields.push('アドバイストーン');
        
        alert(`以下の項目を入力してください: ${missingFields.join(', ')}`);
        return;
    }
    
    // 現在の年齢をチェック
    const age = calculateAge(birthDate);
    if (age < 0) {
        alert('有効な生年月日を入力してください。');
        return;
    }
    
    if (age > 120) {
        alert('入力された年齢が正しくないようです。確認してください。');
        return;
    }
    
    // グローバル変数を設定
    selectedTone = tone;
    targetDate = calculateHealthLifeEndDate(birthDate, gender);
    
    // 結果セクションを表示
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('fade-in');
    
    // カウントダウン開始
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
    
    // アドバイス表示
    displayAdvice();
    
    // 結果メッセージの設定
    const timeDiff = calculateTimeDifference(targetDate);
    if (timeDiff) {
        const message = generateResultMessage(timeDiff.years, timeDiff.days);
        resultMessage.textContent = message;
    }
    
    // 結果セクションにスムーズスクロール
    setTimeout(() => {
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 300);
}

// アドバイスの更新
function refreshAdvice() {
    displayAdvice();
}

// トーン選択の視覚的フィードバック
function setupToneSelection() {
    const toneOptions = document.querySelectorAll('.tone-options input[type="radio"]');
    
    toneOptions.forEach(option => {
        option.addEventListener('change', function() {
            // 他のオプションの選択解除
            const allLabels = document.querySelectorAll('.tone-option');
            allLabels.forEach(label => label.classList.remove('selected'));
            
            // 現在のオプションを選択
            if (this.checked) {
                this.nextElementSibling.classList.add('selected');
            }
        });
    });
}

// ジェンダー選択の視覚的フィードバック
function setupGenderSelection() {
    const genderOptions = document.querySelectorAll('.gender-options input[type="radio"]');
    
    genderOptions.forEach(option => {
        option.addEventListener('change', function() {
            const allLabels = document.querySelectorAll('.gender-options label');
            allLabels.forEach(label => label.classList.remove('selected'));
            
            if (this.checked) {
                this.nextElementSibling.classList.add('selected');
            }
        });
    });
}

// インtersection Observerを使ったアニメーション
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // 観察対象の要素を設定
    const animateElements = document.querySelectorAll('.form-container, .countdown-card, .todo-card, .advice-card');
    animateElements.forEach(el => observer.observe(el));
}

// ページ離脱時の確認
function setupBeforeUnload() {
    window.addEventListener('beforeunload', function(event) {
        if (countdownInterval) {
            event.preventDefault();
            event.returnValue = '';
        }
    });
}

// DOMContentLoadedイベント
document.addEventListener('DOMContentLoaded', function() {
    // 各機能の初期化
    setupToneSelection();
    setupGenderSelection();
    setupScrollAnimations();
    setupSocialShare();
    setupBeforeUnload();
    
    // イベントリスナーの設定
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    if (newAdviceBtn) {
        newAdviceBtn.addEventListener('click', refreshAdvice);
    }
    
    if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener('click', scrollToForm);
    }
    
    // ページ読み込み時に言い訳を表示
    displayRandomExcuse();
    
    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('fade-in');
        }, 100);
    }
    
    // ウィンドウサイズ変更時の処理
    window.addEventListener('resize', function() {
        // レスポンシブ対応のための処理
        const timeUnits = document.querySelectorAll('.time-unit');
        timeUnits.forEach(unit => {
            unit.style.transform = 'none';
            setTimeout(() => {
                unit.style.transform = '';
            }, 100);
        });
    });
});

// 追加のカスタムスタイルを動的に適用
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .selected {
            border-color: var(--accent-terracotta) !important;
            background-color: var(--accent-terracotta) !important;
            color: var(--white) !important;
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px var(--medium-shadow);
        }
        
        .exceeded-message {
            text-align: center;
            padding: var(--spacing-xl);
            background: var(--white);
            border-radius: 20px;
            box-shadow: 0 8px 30px var(--light-shadow);
            border: 2px solid var(--accent-terracotta);
        }
        
        .time-value.animate {
            animation: flipNumber 0.6s ease-in-out;
        }
        
        @keyframes flipNumber {
            0% { transform: rotateX(0deg); }
            50% { transform: rotateX(90deg); }
            100% { transform: rotateX(0deg); }
        }
        
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .error-message {
            color: var(--accent-terracotta);
            font-weight: 600;
            text-align: center;
            padding: var(--spacing-sm);
            background: rgba(201, 112, 95, 0.1);
            border-radius: 10px;
            margin-top: var(--spacing-sm);
        }
    `;
    document.head.appendChild(style);
}

// カスタムスタイルを追加
addCustomStyles();

// デバッグ用（開発時のみ）
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('健康寿命カウンター デバッグモード');
    console.log('健康寿命データ:', { HEALTH_LONGEVITY_MALE, HEALTH_LONGEVITY_FEMALE });
}