import { n as e } from "./analysisDemo-DiaidRaO.js";
var t = `admin-demo-db-v3`,
  n = `analysis-demo-v3`,
  r = (e, t = 10) => {
    let n = new Date();
    return (
      n.setDate(n.getDate() + e),
      n.setHours(t, 0, 0, 0),
      n.toISOString()
    );
  },
  i = (e) => r(e).slice(0, 10),
  a = () => Math.random().toString(36).slice(2, 10);
function o() {
  let e = (e, t, n, i) => ({
    id: e,
    name: t,
    phone: n,
    education: `高三`,
    budget: `30-50万`,
    country: `英国`,
    project: `英国2+2`,
    source: `小程序`,
    owner: ``,
    level: `C`,
    status: `待跟进`,
    tags: [],
    created_at: r(-1),
    ...i,
  });
  let pool = [
    [`何雨泽`, `高三`, `英国`, `英国2+2`, `30-50万`, `微信搜索`, `A`],
    [`马思远`, `高二`, `澳洲`, `澳洲3+1`, `20-30万`, `好友转发`, `B`],
    [`许安然`, `本科大三`, `香港`, `香港硕士`, `50万以上`, `公众号`, `A`],
    [`冯予安`, `本科大四`, `新加坡`, `新加坡直博`, `30-50万`, `招生老师二维码`, `B`],
    [`曹清和`, `高三`, `英国`, `英国硕士`, `20万以内`, `线下活动二维码`, `C`],
    [`邓晓舟`, `高三`, `澳洲`, `澳洲3+1`, `30-50万`, `广告投放`, `A`],
    [`蒋知夏`, `高二`, `英国`, `英国2+2`, `20-30万`, `官网`, `B`],
    [`沈予白`, `本科大三`, `新加坡`, `新加坡直博`, `50万以上`, `朋友圈`, `A`],
    [`韩慕辰`, `高三`, `香港`, `香港硕士`, `30-50万`, `其他渠道`, `C`],
    [`顾星河`, `本科大四`, `英国`, `英国硕士`, `20-30万`, `微信搜索`, `B`],
    [`姚晚宁`, `高三`, `澳洲`, `澳洲3+1`, `30-50万`, `好友转发`, `A`],
    [`潘书意`, `高二`, `英国`, `英国2+2`, `20万以内`, `公众号`, `C`],
  ];
  let owners = [``, `张老师`, `刘老师`, `王老师`];
  let extra = pool.map((row, idx) => {
    let owner = owners[idx % owners.length];
    let status = !owner ? `待跟进` : idx % 5 === 0 ? `已报名` : `跟进中`;
    return e(`s${idx + 1}`, row[0], `1860001${String(idx + 1).padStart(4, `0`)}`, {
      education: row[1],
      country: row[2],
      project: row[3],
      budget: row[4],
      source: row[5],
      level: row[6],
      owner,
      status,
      created_at: r(-(idx + 1), 9 + (idx % 6)),
      last_contact_at: owner ? i(-(idx % 6) - 1) : ``,
      next_follow_at: status === `已报名` ? `` : i(idx % 4 === 0 ? -1 : idx % 3),
      tags: idx % 4 === 0 ? [`高意向`] : [],
      booked: status === `已报名` || idx % 3 === 0,
      visited: status === `已报名`,
      enrolled: status === `已报名`,
    });
  });
  return {
    leads: [
      e(`l1`, `王子涵家长`, `13856001234`, {
        wechat: `wzh_2026`,
        created_at: r(0, 9),
        level: `A`,
        tags: [`高意向`, `关注奖学金`],
      }),
      e(`l2`, `李明轩`, `13955102233`, {
        created_at: r(0, 8),
        country: `澳洲`,
        project: `澳洲3+1`,
        source: `开放日`,
      }),
      e(`l3`, `陈思雨家长`, `18756003344`, {
        wechat: `chensiyu_mom`,
        owner: `张老师`,
        level: `A`,
        status: `跟进中`,
        next_follow_at: i(-2),
        last_contact_at: i(-6),
        tags: [`家长决策`],
        booked: !0,
      }),
      e(`l4`, `赵一鸣`, `15256104455`, {
        owner: `张老师`,
        level: `B`,
        status: `跟进中`,
        next_follow_at: i(0),
        last_contact_at: i(-3),
        country: `香港`,
        project: `香港硕士`,
        education: `本科大三`,
      }),
      e(`l5`, `孙佳怡`, `13685105566`, {
        owner: `刘老师`,
        level: `B`,
        status: `跟进中`,
        next_follow_at: i(2),
        last_contact_at: i(-1),
        tags: [`价格敏感`],
      }),
      e(`l6`, `周浩然家长`, `13956106677`, {
        owner: `刘老师`,
        level: `A`,
        status: `已报名`,
        booked: !0,
        visited: !0,
        enrolled: !0,
        last_contact_at: i(-4),
      }),
      e(`l7`, `吴雨桐`, `18256107788`, {
        owner: `张老师`,
        level: `C`,
        status: `无效`,
        tags: [`空号`],
      }),
      e(`l8`, `郑凯文`, `13856001234`, { created_at: r(-3), source: `公众号` }),
      e(`l9`, `黄心怡家长`, `17756108899`, {
        owner: `刘老师`,
        level: `A`,
        status: `跟进中`,
        next_follow_at: i(-1),
        last_contact_at: i(-8),
        booked: !0,
        visited: !0,
        country: `新加坡`,
        project: `新加坡直博`,
      }),
      e(`l10`, `林子墨`, `15056109900`, {
        created_at: r(-2),
        source: `朋友推荐`,
        level: `B`,
      }),
      e(`l11`, `钱小满家长`, `13900001111`, {
        owner: `王老师`,
        level: `A`,
        status: `跟进中`,
        education: `高二`,
        country: `澳洲`,
        project: `澳洲3+1`,
        source: `微信搜索`,
        next_follow_at: i(1),
        last_contact_at: i(-2),
        tags: [`家长决策`],
      }),
      e(`l12`, `钱小满`, `13900001111`, {
        created_at: r(-4),
        source: `好友转发`,
        level: `B`,
        education: `高二`,
        country: `澳洲`,
        project: `澳洲3+1`,
      }),
      e(`l13`, `苏晚晴`, `15800002222`, {
        owner: `王老师`,
        level: `B`,
        status: `跟进中`,
        education: `本科大三`,
        country: `英国`,
        project: `英国硕士`,
        budget: `50万以上`,
        source: `官网`,
        next_follow_at: i(0),
        last_contact_at: i(-1),
      }),
      e(`l14`, `陆景行`, `13700003333`, {
        owner: `张老师`,
        level: `A`,
        status: `跟进中`,
        education: `高三`,
        country: `新加坡`,
        project: `新加坡直博`,
        source: `线下活动二维码`,
        booked: !0,
        next_follow_at: i(3),
        last_contact_at: i(-2),
      }),
      ...extra,
    ],
    lead_notes: [
      {
        id: `n1`,
        lead_id: `l3`,
        author: `张老师`,
        note: `电话沟通，家长关心住宿和安全，约了周六到校。`,
        created_at: r(-6),
      },
      {
        id: `n2`,
        lead_id: `l4`,
        author: `张老师`,
        note: `微信发送了香港硕士项目介绍。`,
        created_at: r(-3),
      },
      {
        id: `n3`,
        lead_id: `l9`,
        author: `刘老师`,
        note: `已到访，对新加坡项目很感兴趣，等家长商量。`,
        created_at: r(-8),
      },
    ],
    bookings: [
      {
        id: `b1`,
        name: `陈思雨家长`,
        phone: `18756003344`,
        people: 2,
        visit_date: i(3),
        slot: `上午`,
        status: `待确认`,
        created_at: r(-1),
      },
      {
        id: `b3`,
        name: `赵一鸣`,
        phone: `15256104455`,
        people: 1,
        visit_date: i(0),
        slot: `下午`,
        status: `已确认`,
        created_at: r(-2),
      },
      {
        id: `b4`,
        name: `孙佳怡`,
        phone: `13685105566`,
        people: 2,
        visit_date: i(1),
        slot: `上午`,
        status: `待确认`,
        created_at: r(-1),
      },
      {
        id: `b5`,
        name: `李明轩`,
        phone: `13955102233`,
        people: 4,
        visit_date: i(12),
        slot: `下午`,
        status: `待确认`,
        created_at: r(0),
      },
      {
        id: `b2`,
        name: `黄心怡家长`,
        phone: `17756108899`,
        people: 3,
        visit_date: i(-8),
        slot: `下午`,
        status: `已到访`,
        created_at: r(-10),
      },
    ],
    events: [
      {
        id: `e1`,
        name: `2026秋季校园开放日`,
        starts_at: r(4, 9),
        created_at: r(-10),
      },
    ],
    event_signups: [],
    ads: [],
    images: [],
    tags: [],
    projects: [],
    profiles: [],
    user_roles: [],
  };
}
function s() {
  let r;
  try {
    let e = JSON.parse(localStorage.getItem(t) || `null`);
    e && (r = e);
  } catch {}
  if (((r ??= o()), r._settings?.analysisDemoVersion !== n)) {
    let t = e();
    for (let e of [`leads`, `lead_notes`, `bookings`, `traffic`]) {
      let n = new Map(t[e].map((e) => [e.id, e])),
        i = (r[e] || []).map((e) =>
          e.is_demo && n.has(e.id)
            ? { ...n.get(e.id), ...e, ...u(n.get(e.id)) }
            : e,
        ),
        a = new Set(i.map((e) => e.id));
      r[e] = [...i, ...[...n.values()].filter((e) => !a.has(e.id))];
    }
    ((r._settings = { ...r._settings, analysisDemoVersion: n }), d(r));
  }
  let i = (r.profiles ||= []),
    a = !1;
  let removed = new Set(r._settings?.removedProfiles || []);
  for (let e of c) {
    if (removed.has(e.account)) continue;
    let row = i.find((t) => t.account === e.account);
    if (!row) {
      (i.push({
        ...e,
        active: !0,
        createdAt: new Date().toISOString(),
        lastLoginAt: ``,
        online: !1,
      }),
        (a = !0));
      continue;
    }
    row.password || ((row.password = e.password), (a = !0));
  }
  return (a && d(r), r);
}
var c = [
    {
      id: `t-super`,
      account: `admin@aufe.edu.cn`,
      password: `Admin123`,
      name: `超级管理员`,
      role: `super_admin`,
    },
    {
      id: `t-zhang`,
      account: `zhang@aufe.edu.cn`,
      password: `Test123`,
      name: `张老师`,
      role: `advisor`,
    },
    {
      id: `t-liu`,
      account: `liu@aufe.edu.cn`,
      password: `Test123`,
      name: `刘老师`,
      role: `advisor`,
    },
    {
      id: `t-wang`,
      account: `wang@aufe.edu.cn`,
      password: `Test123`,
      name: `王老师`,
      role: `advisor`,
    },
    {
      id: `t-chen`,
      account: `chen@aufe.edu.cn`,
      password: `Test123`,
      name: `陈专员`,
      role: `specialist`,
    },
  ],
  l = [
    `source`,
    `campaign`,
    `country`,
    `project`,
    `program`,
    `education`,
    `budget`,
    `entry_year`,
    `major`,
    `duration`,
    `booked`,
    `booked_at`,
    `lost_at`,
  ];
function u(e) {
  return Object.fromEntries(l.filter((t) => t in e).map((t) => [t, e[t]]));
}
function d(e) {
  localStorage.setItem(t, JSON.stringify(e));
}
async function f(e, t) {
  let n = s(),
    r = (e) => (n[e] ||= []);
  switch (e) {
    case `loginAdmin`: {
      let account = String(t.account || ``).trim().toLowerCase(),
        e = r(`profiles`).find((e) => e.account === account || e.account === t.account);
      let pending = r(`registrations`).find(
        (row) => row.account === account && row.status === `pending`,
      );
      if (!e && pending) throw Error(`注册申请还在等待批准，批准后才能登录`);
      if (e) {
        if (e.password !== t.password) throw Error(`账号或密码不正确`);
        return (
          (e.online = !0),
          (e.lastLoginAt = new Date().toISOString()),
          d(n),
          {
            account: e.account,
            name: e.name,
            token: `demo`,
            role: e.role || `advisor`,
            admin_granted: !!e.admin_granted,
          }
        );
      }
      throw Error(`账号或密码不正确`);
    }
    case `registerAdmin`: {
      let account = String(t.account || ``).trim().toLowerCase(),
        name = String(t.name || ``).trim(),
        password = String(t.password || ``);
      if (name.length < 1 || name.length > 40) throw Error(`姓名 1 到 40 字`);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(account)) throw Error(`邮箱格式不正确`);
      if (password.length < 6) throw Error(`密码至少 6 位`);
      if (r(`profiles`).some((e) => e.account === account)) throw Error(`这个邮箱已经有账号，请直接登录`);
      if (r(`registrations`).some((e) => e.account === account && e.status === `pending`))
        throw Error(`这个邮箱已有待批准的注册申请`);
      let id = a();
      r(`registrations`).unshift({
        id,
        account,
        name,
        password,
        role: `advisor`,
        status: `pending`,
        created_at: new Date().toISOString(),
      });
      r(`notifications`).unshift({
        id: a(),
        to: [`@approver`],
        text: `「${name}」申请注册`,
        kind: `registration`,
        ref: id,
        created_at: new Date().toISOString(),
      });
      return (d(n), { pending: !0 });
    }
    case `listRegistrations`:
      return r(`registrations`)
        .filter((e) => e.status === `pending`)
        .map(({ password: e, ...row }) => row);
    case `reviewRegistration`: {
      let actor = r(`profiles`).find((row) => row.account === t.actor);
      if (!actor || !(actor.role === `super_admin` || (actor.role === `specialist` && actor.admin_granted)))
        throw Error(`只有超级管理员和已授予日常管理权限的专人可以批准注册`);
      let e = r(`registrations`).find((e) => e.id === t.id && e.status === `pending`);
      if (!e) throw Error(`这条申请已经处理过了`);
      let reviewer = String(t.reviewer || `管理员`);
      if (t.decision === `approve`) {
        if (r(`profiles`).some((row) => row.account === e.account)) throw Error(`这个邮箱已经有账号`);
        let role =
          t.role === `specialist` ? `specialist` : t.role === `super_admin` ? `super_admin` : `advisor`;
        (r(`profiles`).push({
          id: a(),
          account: e.account,
          password: e.password,
          name: e.name,
          role,
          active: !0,
          createdAt: new Date().toISOString(),
          lastLoginAt: ``,
          online: !1,
        }),
          (e.status = `approved`),
          (e.role = role));
      } else ((e.status = `rejected`), (e.password = ``), (e.reject_reason = String(t.reason || ``).trim()));
      ((e.reviewed_at = new Date().toISOString()), (e.reviewer = reviewer));
      r(`notifications`).forEach((row) => {
        row.ref === e.id && (row.handled = !0);
      });
      r(`notifications`).unshift({
        id: a(),
        to: [`*`],
        text:
          t.decision === `approve`
            ? `「${e.name}」的注册已通过`
            : `「${reviewer}」驳回了「${e.name}」的注册${e.reject_reason ? `：${e.reject_reason}` : ``}`,
        kind: `account`,
        ref: e.account,
        created_at: new Date().toISOString(),
      });
      break;
    }
    case `logoutAdmin`: {
      let e = r(`profiles`).find((e) => e.account === t?.account);
      e && (e.online = !1);
      break;
    }
    case `changeOwnPassword`: {
      let e = r(`profiles`).find((e) => e.account === t.actor);
      if (!e) throw Error(`账号不存在`);
      let oldPassword = String(t.oldPassword ?? ``);
      if (!oldPassword) throw Error(`请输入旧密码`);
      if (e.password !== oldPassword) throw Error(`旧密码不正确`);
      let password = String(t.password || ``);
      if (password.length < 6) throw Error(`密码至少 6 位`);
      if (password === e.password) throw Error(`新密码不能和旧密码相同`);
      e.password = password;
      if (e.role === `advisor`)
        r(`profile_changes`).unshift({
          id: a(),
          account: e.account,
          name: e.name,
          accountNew: e.account,
          nameNew: e.name,
          field: `password`,
          status: `approved`,
          created_at: new Date().toISOString(),
        });
      break;
    }
    case `requestProfileChange`: {
      let e = r(`profiles`).find((row) => row.account === t.actor);
      if (!e) throw Error(`账号不存在`);
      let name = String(t.name || ``).trim(),
        account = String(t.account || ``).trim().toLowerCase();
      if (name.length < 1 || name.length > 40) throw Error(`姓名 1 到 40 字`);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(account)) throw Error(`邮箱格式不正确`);
      if (name === e.name && account === e.account) throw Error(`姓名和邮箱都没有变化`);
      r(`profile_changes`).forEach((row) => {
        if (row.status !== `pending`) return;
        let owner = r(`profiles`).find(
          (item) => item.account === row.account || item.name === row.name,
        );
        owner?.role === `specialist` && (row.status = `cancelled`);
      });
      if (e.role === `super_admin` || e.role === `specialist`) {
        if (e.role === `super_admin` && account !== e.account)
          throw Error(`超级管理员的邮箱不能在这里修改`);
        if (
          account !== e.account &&
          (r(`profiles`).some((row) => row.account === account && row.id !== e.id) ||
            r(`profile_changes`).some(
              (row) => row.status === `pending` && row.account !== e.account && row.accountNew === account,
            ))
        )
          throw Error(`这个邮箱已经有账号`);
        let oldName = e.name;
        ((e.name = name), (e.account = account));
        if (oldName !== name) {
          e.formerNames = [...new Set([...(e.formerNames || []), oldName])];
          r(`notifications`).forEach((item) => {
            Array.isArray(item.to) &&
              (item.to = item.to.map((itemName) => (itemName === oldName ? name : itemName)));
          });
        }
        break;
      }
      if (
        r(`profiles`).some((row) => row.account === account && row.id !== e.id) ||
        r(`profile_changes`).some(
          (row) => row.status === `pending` && row.account !== e.account && row.accountNew === account,
        )
      )
        throw Error(`这个邮箱已经有账号`);
      let pending = r(`profile_changes`).find((row) => row.account === e.account && row.status === `pending`);
      if (pending) throw Error(`已有待批准的资料申请，请等处理完再提交`);
      let id = a(),
        parts = [];
      name !== e.name && parts.push(`姓名改为「${name}」`);
      account !== e.account && parts.push(`邮箱改为 ${account}`);
      r(`profile_changes`).unshift({
        id,
        account: e.account,
        name: e.name,
        accountNew: account,
        nameNew: name,
        status: `pending`,
        created_at: new Date().toISOString(),
      });
      let recipients = r(`profiles`)
        .filter((row) => row.role === `specialist` && row.admin_granted)
        .map((row) => row.name);
      r(`notifications`).unshift({
        id: a(),
        to: [...new Set([...recipients, e.name])],
        text: `${e.name}申请把${parts.join(`、`)}`,
        kind: `profile`,
        ref: id,
        created_at: new Date().toISOString(),
      });
      break;
    }
    case `listProfileChanges`:
      return r(`profile_changes`);
    case `reviewProfileChange`: {
      let actor = r(`profiles`).find((row) => row.account === t.actor);
      if (
        !actor ||
        !(
          actor.role === `super_admin` ||
          (actor.role === `specialist` && actor.admin_granted)
        )
      )
        throw Error(`只有超级管理员和已授予日常管理权限的专人可以批准资料申请`);
      let e = r(`profile_changes`).find((e) => e.id === t.id && e.status === `pending`);
      if (!e) throw Error(`这条申请已经处理过了`);
      let row = r(`profiles`).find((row) => row.account === e.account);
      if (!row) throw Error(`账号不存在`);
      if (t.decision === `approve`) {
        if (r(`profiles`).some((item) => item.account === e.accountNew && item.id !== row.id))
          throw Error(`这个邮箱已经有账号`);
        let oldName = row.name;
        ((row.name = e.nameNew), (row.account = e.accountNew));
        if (oldName !== row.name) {
          row.formerNames = [...new Set([...(row.formerNames || []), oldName])];
          r(`notifications`).forEach((item) => {
            Array.isArray(item.to) &&
              (item.to = item.to.map((name) => (name === oldName ? row.name : name)));
          });
        }
        e.status = `approved`;
      } else ((e.status = `rejected`), (e.reject_reason = String(t.reason || ``).trim()));
      ((e.reviewed_at = new Date().toISOString()), (e.reviewer = actor.name));
      r(`notifications`).forEach((item) => {
        item.ref === e.id && (item.handled = !0);
      });
      {
        let parts = [];
        e.nameNew !== e.name && parts.push(`姓名`);
        e.accountNew !== e.account && parts.push(`邮箱`);
        let what = parts.join(`和`) || `资料`;
        r(`notifications`).unshift({
          id: a(),
          to: [...new Set([row.name, e.name])],
          text:
            t.decision === `approve`
              ? `「${actor.name}」通过了「${row.name}」的${what}申请`
              : `「${actor.name}」驳回了「${e.name}」的${what}申请${e.reject_reason ? `：${e.reject_reason}` : ``}`,
          kind: `account`,
          ref: row.account,
          created_at: new Date().toISOString(),
        });
      }
      break;
    }
    case `listAdmins`:
      return r(`profiles`).map(({ password: e, ...t }) => t);
    case `createAdvisor`: {
      let actor = r(`profiles`).find((e) => e.account === t.actor);
      if (!actor || !(actor.role === `super_admin` || (actor.role === `specialist` && actor.admin_granted)))
        throw Error(`专人要先得到超级管理员授权，才能新增账号`);
      let role =
        t.role === `specialist` ? `specialist` : t.role === `super_admin` ? `super_admin` : `advisor`;
      if (actor.role !== `super_admin` && role !== `advisor`)
        throw Error(`已授权专人只能新增管理员`);
      if (r(`profiles`).some((e) => e.account === t.account)) throw Error(`这个邮箱已经有账号`);
      r(`profiles`).push({
        id: a(),
        account: t.account,
        password: t.password,
        name: t.name,
        role,
        active: !0,
        createdAt: new Date().toISOString(),
        lastLoginAt: ``,
        online: !1,
      });
      break;
    }
    case `updateProfile`: {
      let actor = r(`profiles`).find((row) => row.account === t.actor);
      if (!actor || !(actor.role === `super_admin` || (actor.role === `specialist` && actor.admin_granted)))
        throw Error(`专人要先得到超级管理员授权，才能修改账号`);
      let e = r(`profiles`).find((e) => e.account === t.account);
      if (!e) throw Error(`账号不存在`);
      let name = String(t.name || ``).trim(),
        account = String(t.accountNew || ``).trim(),
        role =
          t.role === `specialist` ? `specialist` : t.role === `super_admin` ? `super_admin` : `advisor`;
      if (name.length < 1 || name.length > 40) throw Error(`姓名 1 到 40 字`);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(account)) throw Error(`邮箱格式不正确`);
      if (r(`profiles`).some((row) => row.account === account && row.id !== e.id))
        throw Error(`这个邮箱已经有账号`);
      if (actor.role === `super_admin` && actor.account !== e.account) {
        if (name !== e.name || account !== e.account || t.password)
          throw Error(`超级管理员只能修改专人和管理员的身份级别`);
      }
      if (e.role === `super_admin` && actor.account !== e.account)
        throw Error(`不能修改其它超级管理员的任何信息`);
      if (actor.role !== `super_admin`) {
        if (e.role !== `advisor` && actor.account !== e.account)
          throw Error(`已授权专人只能修改管理员的注册信息`);
        if (role !== e.role) throw Error(`只有超级管理员可以修改身份`);
      }
      if (actor.account === e.account && t.password) {
        if (String(t.oldPassword || ``) !== e.password) throw Error(`旧密码不正确`);
        if (String(t.password).length < 6) throw Error(`密码至少 6 位`);
      } else if (t.password && String(t.password).length < 6) throw Error(`密码至少 6 位`);
      let oldName = e.name,
        oldAccount = e.account;
      ((e.name = name), (e.account = account), (e.role = role));
      role !== `specialist` && (e.admin_granted = !1);
      t.password && (e.password = t.password);
      if (oldName !== name || oldAccount !== account) {
        e.formerNames = [...new Set([...(e.formerNames || []), oldName])];
        r(`notifications`).forEach((row) => {
          Array.isArray(row.to) &&
            (row.to = row.to.map((item) => (item === oldName ? name : item)));
        });
      }
      break;
    }
    case `deleteProfile`: {
      let actor = r(`profiles`).find((row) => row.account === t.actor);
      if (!actor || !(actor.role === `super_admin` || (actor.role === `specialist` && actor.admin_granted)))
        throw Error(`专人要先得到超级管理员授权，才能删除账号`);
      let e = r(`profiles`).find((e) => e.account === t.account);
      if (!e) throw Error(`账号不存在`);
      if (e.account === t.actor) throw Error(`不能删除自己当前登录的账号`);
      if (e.role === `super_admin`) throw Error(`不能删除超级管理员`);
      if (actor.role !== `super_admin` && e.role !== `advisor`)
        throw Error(`已授权专人只能删除管理员`);
      if (e.role === `specialist` && actor.role !== `super_admin`)
        throw Error(`只有超级管理员可以删除专人`);
      n.profiles = r(`profiles`).filter((row) => row.account !== e.account);
      n._settings = {
        ...(n._settings || {}),
        removedProfiles: [...new Set([...(n._settings?.removedProfiles || []), e.account])],
      };
      break;
    }
    case `adminBundle`: {
      let seen = new Map();
      for (let e of r(`notifications`)) {
        let text = String(e.text || ``);
        for (let match of text.matchAll(/账号\s*([^（「\s]{1,40})（([^）]+)）/g)) {
          let name = match[1],
            account = match[2],
            row = r(`profiles`).find((e) => e.account === account);
          row && seen.set(account, [...(seen.get(account) || []), name]);
          text.includes(`「${name}」`) ||
            (text = text.replaceAll(`${match[1]}（${account}）`, `「${name}」（${account}）`));
        }
        for (let match of text.matchAll(/「?([^「」（\s]{1,40})」?（专人）/g)) {
          let row = r(`profiles`).find(
            (e) => e.name === match[1] || (e.formerNames || []).includes(match[1]),
          );
          row && (text = text.replaceAll(match[0], row.name));
        }
        e.text = text;
      }
      for (let [account, names] of seen) {
        let row = r(`profiles`).find((e) => e.account === account);
        if (!row) continue;
        let old = [...new Set(names.filter((e) => e && e !== row.name))];
        old.length && (row.formerNames = [...new Set([...(row.formerNames || []), ...old])]);
      }
      d(n);
      return {
        ...n,
        school: n._settings?.school || {},
        system: n._settings?.system || {},
      };
    }
    case `adminSaveSetting`: {
      let actor = r(`profiles`).find((e) => e.account === t.actor);
      let allowed = actor && (actor.role === `super_admin` || (actor.role === `specialist` && actor.admin_granted));
      if (t.key === `system` && !allowed) throw Error(`只有超级管理员和已授予日常管理权限的专人可以修改预约名额`);
      n._settings = { ...(n._settings || {}), [t.key]: t.value };
      break;
    }
    case `adminSave`: {
      let { note: e, author: i, ...o } = t.values || {};
      if (
        (t.table === `leads` || t.table === `transfers`) &&
        o.owner &&
        r(`profiles`).some((e) => e.role === `super_admin` && e.name === o.owner)
      )
        throw Error(`不能转交给超级管理员`);
      if (t.table === `transfers` && o.status === `待审批`) {
        let from = r(`profiles`).find((e) => e.name === o.from),
          to = r(`profiles`).find((e) => e.name === o.to);
        if (!from || from.role !== `advisor` || !to || to.role !== `advisor`)
          throw Error(`转交申请只能由管理员提交给管理员`);
      }
      if (
        t.table === `transfers` &&
        o.to &&
        r(`profiles`).some((e) => e.role === `super_admin` && e.name === o.to)
      )
        throw Error(`不能转交给超级管理员`);
      let s = r(t.table),
        c = t.id || a(),
        l = s.findIndex((e) => e.id === c);
      return (
        l >= 0
          ? (s[l] = { ...s[l], ...o })
          : s.push({ id: c, created_at: new Date().toISOString(), ...o }),
        t.table === `leads` &&
          e &&
          r(`lead_notes`).unshift({
            id: a(),
            lead_id: c,
            author: i || ``,
            note: e,
            created_at: new Date().toISOString(),
          }),
        d(n),
        { id: c }
      );
    }
    case `adminRemove`:
      n[t.table] = r(t.table).filter((e) => e.id !== t.id);
      break;
    case `adminAssignLeads`: {
      if (r(`profiles`).some((e) => e.role === `super_admin` && e.name === t.owner))
        throw Error(`不能分配给超级管理员`);
      let changed = r(`leads`).filter((e) => t.ids.includes(e.id));
      changed.forEach((e) => {
        ((e.owner = t.owner), e.status === `待跟进` && (e.status = `跟进中`));
      });
      break;
    }
    case `adminMergeLeads`:
      (r(`leads`).forEach((e) => {
        t.dropIds.includes(e.id) && (e.mergedInto = t.keepId);
      }),
        r(`lead_notes`).forEach((e) => {
          t.dropIds.includes(e.lead_id) &&
            ((e.merged_from = e.lead_id), (e.lead_id = t.keepId));
        }));
      break;
    case `adminUnmergeLeads`:
      (r(`leads`).forEach((e) => {
        t.dropIds.includes(e.id) &&
          e.mergedInto === t.keepId &&
          delete e.mergedInto;
      }),
        r(`lead_notes`).forEach((e) => {
          t.dropIds.includes(e.merged_from) &&
            ((e.lead_id = e.merged_from), delete e.merged_from);
        }));
      break;
    case `setAdminGrant`: {
      let actor = r(`profiles`).find((row) => row.account === t.actor);
      if (!actor || actor.role !== `super_admin`)
        throw Error(`只有超级管理员可以授予或移除日常管理权限`);
      let e = r(`profiles`).find((e) => e.account === t.account);
      if (!e) throw Error(`账号不存在`);
      if (e.role !== `specialist`) throw Error(`只能给专人设置管理员权限`);
      e.admin_granted = !!t.grant;
      break;
    }
    case `saveOpenDay`: {
      let e = a();
      return (
        r(`events`).push({ id: e, ...t, created_at: new Date().toISOString() }),
        d(n),
        { id: e }
      );
    }
    case `adminKeepUpload`:
      r(`images`).push({
        id: a(),
        url: t.url,
        created_at: new Date().toISOString(),
      });
  }
  return (d(n), null);
}
export { f as demoCloud };
