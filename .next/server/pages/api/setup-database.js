"use strict";(()=>{var e={};e.id=284,e.ids=[284],e.modules={5600:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6762:(e,s)=>{Object.defineProperty(s,"M",{enumerable:!0,get:function(){return function e(s,r){return r in s?s[r]:"then"in s&&"function"==typeof s.then?s.then(s=>e(s,r)):"function"==typeof s&&"default"===r?s:void 0}}})},5872:(e,s,r)=>{r.r(s),r.d(s,{config:()=>l,default:()=>c,routeModule:()=>u});var t={};r.r(t),r.d(t,{default:()=>T});var a=r(9947),i=r(2706),o=r(6762);let E=require("@supabase/supabase-js"),n=process.env.SUPABASE_SERVICE_KEY||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4eXZxc2V2ZWtyaHd6anVseWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NTMzNDgsImV4cCI6MjA2ODIyOTM0OH0.1uG9-dGGkuiFFWz0zxtjN54dPjMxbSWjii0n9SC-KgY";async function T(e,s){if("POST"!==e.method)return s.status(405).json({error:"Method not allowed"});try{let e=(0,E.createClient)("https://zxyvqsevekrhwzjulyaq.supabase.co",n);console.log("\uD83D\uDE80 Setting up ShadowME database tables...");let{error:r}=await e.rpc("execute_sql",{sql:`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY DEFAULT auth.uid(),
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
          purpose TEXT DEFAULT 'conversation' CHECK (purpose IN ('conversation', 'business', 'exam')),
          total_sessions INTEGER DEFAULT 0,
          total_practice_time INTEGER DEFAULT 0,
          average_accuracy DECIMAL(5,2) DEFAULT 0.0,
          streak_count INTEGER DEFAULT 0,
          last_practice TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `});r&&console.error("Profile table error:",r);let{error:t}=await e.rpc("execute_sql",{sql:`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          session_type TEXT NOT NULL CHECK (session_type IN ('level_test', 'practice', 'tutorial')),
          level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
          purpose TEXT CHECK (purpose IN ('conversation', 'business', 'exam')),
          practice_time INTEGER DEFAULT 0,
          overall_accuracy DECIMAL(5,2) DEFAULT 0.0,
          sentences_completed INTEGER DEFAULT 0,
          total_sentences INTEGER DEFAULT 0,
          sentence_results JSONB,
          voice_analysis JSONB,
          completed_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `});t&&console.error("Session table error:",t);let{error:a}=await e.rpc("execute_sql",{sql:`
        CREATE TABLE IF NOT EXISTS daily_progress (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          date DATE NOT NULL,
          practice_time INTEGER DEFAULT 0,
          lessons_completed INTEGER DEFAULT 0,
          total_sessions INTEGER DEFAULT 0,
          accuracy_scores DECIMAL(5,2)[] DEFAULT '{}',
          average_accuracy DECIMAL(5,2) DEFAULT 0.0,
          daily_goal_achieved BOOLEAN DEFAULT FALSE,
          streak_maintained BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, date)
        );
      `});a&&console.error("Progress table error:",a);let{error:i}=await e.rpc("execute_sql",{sql:`
        CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_daily_progress_user_date ON daily_progress(user_id, date);
      `});return i&&console.error("Index creation error:",i),console.log("✅ Database setup completed successfully"),s.json({success:!0,message:"Database tables created successfully",tables:["user_profiles","user_sessions","daily_progress"],timestamp:new Date().toISOString()})}catch(e){return console.error("\uD83D\uDCA5 Database setup failed:",e),s.status(500).json({error:"Database setup failed",details:e instanceof Error?e.message:String(e)})}}let c=(0,o.M)(t,"default"),l=(0,o.M)(t,"config"),u=new a.PagesAPIRouteModule({definition:{kind:i.A.PAGES_API,page:"/api/setup-database",pathname:"/api/setup-database",bundlePath:"",filename:""},userland:t})},2706:(e,s)=>{var r;Object.defineProperty(s,"A",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE",e.IMAGE="IMAGE"}(r||(r={}))},9947:(e,s,r)=>{e.exports=r(5600)}};var s=require("../../webpack-api-runtime.js");s.C(e);var r=s(s.s=5872);module.exports=r})();