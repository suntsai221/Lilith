import { customFields, utils } from '@mirrormedia/lilith-core'
import { list } from '@keystone-6/core';
import { checkbox, select, relationship, json, timestamp, text } from '@keystone-6/core/fields';
	  
const {
  allowRoles,
  admin,
  moderator,
  editor,
  owner,
} = utils.accessControl

const listConfigurations = list ({
  fields: {
    person: relationship({
      label: '候選人-選舉',
      many: false,
      ref: 'PersonElection',
    }),
    thread_parent: relationship({
      label: 'Thread',
      many: false,
      ref: 'Politic',
    }),
    desc: text({ 
	  label: '政見', 
	  ui: {
		displayMode: 'textarea',
	  },
	}),
    content: text({ 
	  label: '政策補充說明', 
	  ui: {
		displayMode: 'textarea',
	  },
	}),
    current_progress: select({
      defaultValue: 'no-progress', 
      options: [ 
        { label: '還沒開始', value: 'no-progress' }, 
        { label: '進行中', value: 'in-progress' }, 
        { label: '卡關中', value: 'in-trouble' },
        { label: '已完成', value: 'complete' },
      ], 
      label: '政見進度',
    }),
	positionChange: relationship({
	  label: '立場變化',
	  many: true,
	  ui: {
		displayMode: 'cards',
		linkToItem: true,
	    cardFields: ['checkDate', 'positionChangeSummary', 'content', 'isChanged', 'link', 'factcheckPartner'],
	    inlineCreate: { 'fields': ['checkDate', 'positionChangeSummary', 'content', 'isChanged', 'link', 'factcheckPartner'] },
	    inlineEdit: { 'fields': ['checkDate', 'positionChangeSummary', 'content', 'isChanged', 'link', 'factcheckPartner'] },
	  },
	  ref: 'PoliticPositionChange.politic',
	}),
	factCheck: relationship({
	  label: '事實查核',
	  many: true,
	  ui: {
		displayMode: 'cards',
		linkToItem: true,
	    cardFields: ['checkDate', 'factCheckSummary', 'content', 'checkResultType', 'link', 'factcheckPartner'],
	    inlineCreate: { 'fields': ['checkDate', 'factCheckSummary', 'content', 'checkResultType', 'link', 'factcheckPartner'] },
	    inlineEdit: { 'fields': ['checkDate', 'factCheckSummary', 'content', 'checkResultType', 'link', 'factcheckPartner'] },
	  },
	  ref: 'PoliticFactCheck.politic',
	}),
	expertPoint: relationship({
	  label: '專家觀點',
	  many: true,
	  ref: 'PoliticExpert.politic',
	  ui: {
		displayMode: 'cards',
		linkToItem: true,
	    cardFields: ['content', 'expert', 'avatar', 'title', 'reviewDate', 'expertPointSummary', 'link', 'contributer'],
	    inlineCreate: { 'fields': ['content', 'expert', 'avatar', 'title', 'reviewDate', 'expertPointSummary', 'link', 'contributer']},
	    inlineEdit: {'fields': ['content', 'expert', 'avatar', 'title', 'reviewDate', 'expertPointSummary', 'link', 'contributer']},
	  },
	}),
	repeat: relationship({
	  label: '重複政見',
	  many: true,
	  ref: 'PoliticRepeat.politic',
	  ui: {
		displayMode: 'cards',
		linkToItem: true,
	    cardFields: ['content', 'checkDate', 'checkResultType', 'factcheckPartner', 'link'],
	    inlineCreate: { 'fields': ['content', 'checkDate', 'checkResultType', 'factcheckPartner', 'link']},
	    inlineEdit: { 'fields': ['content', 'checkDate', 'checkResultType', 'factcheckPartner', 'link']},
	  },
	}),
	controversies: relationship({
	  label: '爭議內容',
	  many: true,
	  ref: 'PoliticControversie.politic',
	  ui: {
		displayMode: 'cards',
		linkToItem: true,
	    cardFields: ['content', 'checkDate', 'controversiesSummary', 'link', 'contributer'],
	    inloineCreate: { 'fields': ['content', 'checkDate', 'controversiesSummary', 'link', 'contributer']},
	    inlineEdit: { 'fields': ['content', 'checkDate', 'controversiesSummary', 'link', 'contributer']},
	  },
	}),
	response: relationship({
	  label: '政見回應',
	  many: true,
	  ref: 'PoliticResponse.politic',
	  ui: {
		displayMode: 'cards',
		linkToItem: true,
	    cardFields: ['checkDate', 'content', 'responseName', 'responsePic', 'responseTitle', 'link', 'contributer'],
	    inlineCreate: { 'fields': ['checkDate', 'content', 'responseName', 'responsePic', 'responseTitle', 'link', 'contributer']},
	    inlineEdit: {'fields': ['checkDate', 'content', 'responseName', 'responsePic', 'responseTitle', 'link', 'contributer']},
	  },
	}),
    dispute: text({
      label: '爭議事件',
	  ui: {
		displayMode: 'textarea',
	  },
    }),
    source: text({ 
	  label: '資料來源',
	  ui: {
		displayMode: 'textarea',
	  },
	}),
    contributer: text({ 
	  label: '資料提供',
	  ui: {
		displayMode: 'textarea',
	  },
	}),
    timeline: relationship({
      label: '時間軸',
      many: true,
      ref: 'PoliticTimeline.politic',
    }),
	status: select({
	  options: [
	    { label: '已確認', value: 'verified' },
	    { label: '未確認', value: 'notverified' },
	  ],
	  defaultValue: 'notverified',
	  label: '狀態',
	}),
    tag: relationship({
      label: '標籤',
      many: false,
      ref: 'Tag',
    }),
	checked: checkbox({
	  defaultValue: false,
	  label: '已查核',
	}),
	reviewed: checkbox({
	  defaultValue: false,
	  label: '檢閱',
	}),
    // memberships: { label: "memberships", type: Relationship, many: false, ref: 'Membership' },
  },
  access: {
	operation: {
	  query: allowRoles(admin, moderator, editor),
	  update: allowRoles(admin, moderator),
	  create: allowRoles(admin, moderator),
	  delete: allowRoles(admin),
	},
  },
  hooks: {
	beforeOperation: async ({
	  operation,
	  resolvedData,
	  context,
	  item
	}) => { /* ... */ 
	  var checked = item?.checked || false
	  if (operation === 'create' && context.session?.data?.role === 'admin') {
		resolvedData.status = 'verified'
		resolvedData.reviewed = true
	  }
	  if (operation === 'create' || operation === 'update') {
		if (resolvedData.factCheck || resolvedData.positionChange || resolvedData.repeat) {
			checked = true
		}
	  }
	  if (operation === 'update') {
		if (item.checked === true && !resolvedData.checked) {
		  checked = false
		} else if (!item.checked && resolvedData.checked === true) {
		  checked = true
		}
	  }
	  resolvedData.checked = checked
	},
  },
})
export default utils.addTrackingFields(listConfigurations)
