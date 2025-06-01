"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useEffect, useState } from "react"

export default function LandingPage() {
  const { supabase } = useSupabase()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }
    
    checkSession()
    
    // セッション変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })
    
    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="relative isolate overflow-hidden bg-gradient-to-br from-sky-50 to-white py-16 sm:py-24 md:py-32"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="text-center lg:text-left">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800 ring-1 ring-inset ring-blue-700/20"
                >
                  防災・減災への新しいアプローチ
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  <span className="text-sky-600">Path</span>Guardian
                </h1>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mt-4 text-xl font-semibold text-sky-700"
                >
                  🛡️「いつもの道」に潜む危険を見える化
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-6 text-base leading-8 text-gray-600"
                >
                  AI で通学路・通勤路のリスクをシミュレーション<br/>
                  <span className="inline-block mt-2 text-sky-600 font-medium">📱 スマホで撮るだけ、防災・減災対策に！</span>
                </motion.p>
                
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-y-4 sm:gap-y-0 sm:gap-x-6">
                  {isLoggedIn === null ? (
                    // ローディング中
                    <div className="rounded-md bg-gray-400 px-6 py-3 text-sm font-semibold text-white w-full sm:w-auto">
                      読み込み中...
                    </div>
                  ) : isLoggedIn ? (
                    // ログイン済み
                    <Link
                      href="/map"
                      className="rounded-md bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 w-full sm:w-auto"
                    >
                      マップを見る
                    </Link>
                  ) : (
                    // 未ログイン
                    <Link
                      href="/register"
                      className="rounded-md bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 w-full sm:w-auto"
                    >
                      今すぐはじめる
                    </Link>
                  )}
                  
                  <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                    機能を見る <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* メインビジュアル */}
            <motion.div 
              className="order-1 lg:order-2 flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
                <Image
                  src="/landing/images/safety-pattern.jpg"
                  alt="PathGuardian - AIで通学路のリスクをシミュレーション"
                  width={1200}
                  height={800}
                  className="relative w-full h-auto rounded-xl shadow-2xl ring-1 ring-gray-200 z-10"
                  priority
                />
              </div>
            </motion.div>
          </div>

          {/* マッププレビュー */}
          <motion.div 
            className="relative mt-20 sm:mt-24"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <Image
              src="/landing/map-preview.png"
              alt="アプリのスクリーンショット"
              width={1364}
              height={866}
              className="w-full rounded-xl shadow-xl ring-1 ring-gray-200"
              priority
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-sky-600/30 to-transparent opacity-30"></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Concept Section */}
      <motion.section 
        className="bg-gradient-to-b from-white to-sky-50 py-16 sm:py-20 md:py-28"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-sky-600">Concept</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              普段の風景の向こうに見えるリスク
            </p>
            <motion.p 
              className="mt-4 sm:mt-6 text-base leading-7 text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              「みちのリスク可視化マップ」は、普段の風景をAIが分析。<br className="hidden sm:inline" />
              地震・災害時に崩れそうな構造物をシミュレーションし、安心・安全を可視化します。
            </motion.p>
          </div>
          
          <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AIリスクスキャン",
                desc: "写真をAIが分析して危険度を5段階で評価。構造物の脆弱性をハイライト。",
                color: "from-sky-400 to-blue-500",
              },
              {
                title: "災害シミュレーション",
                desc: "地震・大雨・強風などの災害時に、どのような影響が出るかを可視化。",
                color: "from-red-400 to-orange-500",
              },
              {
                title: "コミュニティの知恵",
                desc: "地域の人々の報告やフィードバックを集約し、より精度の高いマップを実現。",
                color: "from-emerald-400 to-green-500",
              },
            ].map((item, i) => (
              <motion.div 
                key={item.title}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
              >
                <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 sm:text-base">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-sky-600">Features</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              安全を守るための多彩な機能
            </p>
            <p className="mt-4 sm:mt-6 text-base leading-7 text-gray-600">
              危険箇所の報告からランキング、ポイント制まで、楽しみながら安全意識を高められます。
            </p>
          </div>
          <motion.div
            className="mt-12 sm:mt-16 grid grid-cols-1 gap-10 sm:gap-16 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } },
            }}
          >
            {[
              {
                title: "危険箇所の報告",
                desc: "写真や位置情報を添えてワンタップで報告。AI がリスクを自動解析。",
                icon: "📍",
              },
              {
                title: "インタラクティブマップ",
                desc: "報告がリアルタイムに反映される地図で一目で危険エリアを把握。",
                icon: "🗺️",
              },
              {
                title: "ランキング＆バッジ",
                desc: "安全活動への貢献度に応じてポイント・バッジを獲得。",
                icon: "🏅",
              },
              {
                title: "ダッシュボード",
                desc: "通学路の統計や達成状況をビジュアルで確認。",
                icon: "📊",
              },
              {
                title: "学校・自治体連携",
                desc: "CSV エクスポートや API で行政の安全対策と連携可能。",
                icon: "🏫",
              },
              {
                title: "モバイル最適化",
                desc: "撮影・投稿・閲覧をスマホでスムーズに。PWA 対応。",
                icon: "📱",
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                className="flex items-start gap-x-3 sm:gap-x-4"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                <div className="flex-shrink-0 text-2xl sm:text-3xl">{f.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{f.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How to use Section */}
      <section className="bg-gray-50 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-sky-600">How it works</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              3 ステップで簡単スタート
            </p>
          </div>
          <ol className="mt-10 sm:mt-16 space-y-8 sm:space-y-12 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-12 md:space-y-0">
            {[
              {
                step: 1,
                title: "無料登録",
                desc: "メールアドレスまたは Google / LINE でサインアップ。",
              },
              {
                step: 2,
                title: "危険箇所を投稿",
                desc: "撮影した写真と場所を選択して投稿。AI がリスク度を自動表示。",
              },
              {
                step: 3,
                title: "マップで共有",
                desc: "地域の保護者・学校・自治体と情報を共有し、安全対策へ。",
              },
            ].map((item) => (
              <li key={item.step} className="relative pl-14 sm:pl-16">
                <span className="absolute left-0 top-0 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-sky-600 text-white text-base sm:text-lg font-bold">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold leading-7 text-gray-900 sm:text-xl">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600 sm:mt-2 sm:text-base">{item.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-sky-600 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            さあ、あなたの通学路をもっと安全に
          </h2>
          <p className="mt-4 sm:mt-6 text-base leading-7 text-sky-100 sm:text-lg">
            今すぐ無料で始めて、地域の安全づくりに参加しましょう。
          </p>
          <div className="mt-8 sm:mt-10 flex justify-center">
            {isLoggedIn === null ? (
              // ローディング中
              <div className="w-full sm:w-auto rounded-md bg-gray-400/50 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white">
                読み込み中...
              </div>
            ) : isLoggedIn ? (
              // ログイン済み
              <Link
                href="/map"
                className="w-full sm:w-auto rounded-md bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-sm ring-1 ring-inset ring-white/30 backdrop-blur hover:bg-white/20"
              >
                マップを見る
              </Link>
            ) : (
              // 未ログイン
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-md bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-sm ring-1 ring-inset ring-white/30 backdrop-blur hover:bg-white/20"
              >
                無料アカウントを作成
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-xs sm:text-sm">
          <p>© 2025 通学路安全マップ. All rights reserved.</p>
          <div className="mt-4 sm:mt-0 flex gap-x-6">
            <Link href="/terms" className="hover:text-gray-300">利用規約</Link>
            <Link href="/privacy" className="hover:text-gray-300">プライバシー</Link>
            {isLoggedIn && (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.reload()
                }}
                className="hover:text-gray-300"
              >
                ログアウト
              </button>
            )}
          </div>
        </div>
      </footer>
    </>
  )
} 