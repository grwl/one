/* -------------------------------------------------------------------------- */
/* Copyright 2002-2013, OpenNebula Project (OpenNebula.org), C12G Labs        */
/*                                                                            */
/* Licensed under the Apache License, Version 2.0 (the "License"); you may    */
/* not use this file except in compliance with the License. You may obtain    */
/* a copy of the License at                                                   */
/*                                                                            */
/* http://www.apache.org/licenses/LICENSE-2.0                                 */
/*                                                                            */
/* Unless required by applicable law or agreed to in writing, software        */
/* distributed under the License is distributed on an "AS IS" BASIS,          */
/* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   */
/* See the License for the specific language governing permissions and        */
/* limitations under the License.                                             */
/* -------------------------------------------------------------------------- */

/*Users tab plugin*/
var dataTable_users;
var users_select="";
var $create_user_dialog;
var $user_quotas_dialog;
var $update_pw_dialog;

var user_acct_graphs = [
    { title : tr("CPU"),
      monitor_resources : "CPU",
      humanize_figures : false
    },
    { title : tr("Memory"),
      monitor_resources : "MEMORY",
      humanize_figures : true
    },
    { title : tr("Net TX"),
      monitor_resources : "NETTX",
      humanize_figures : true
    },
    { title : tr("Net RX"),
      monitor_resources : "NETRX",
      humanize_figures : true
    }
];


var users_tab_content = '\
<form class="custom" id="user_form" action="">\
<div class="panel">\
<div class="row">\
  <div class="twelve columns">\
    <h4 class="subheader header">\
      <span class="header-resource">\
        <i class="icon-user"></i> '+tr("Users")+'\
      </span>\
      <span class="header-info">\
        <span id="total_users"/> <small>'+tr("TOTAL")+'</small>\
      </span>\
      <span class="user-login">\
      </span>\
    </h4>\
  </div>\
</div>\
<div class="row">\
  <div class="nine columns">\
    <div class="action_blocks">\
    </div>\
  </div>\
  <div class="three columns">\
    <input id="user_search" type="text" placeholder="'+tr("Search")+'" />\
  </div>\
  <br>\
  <br>\
</div>\
</div>\
  <div class="row">\
    <div class="twelve columns">\
<table id="datatable_users" class="datatable twelve">\
  <thead>\
    <tr>\
      <th class="check"><input type="checkbox" class="check_all" value=""></input></th>\
      <th>'+tr("ID")+'</th>\
      <th>'+tr("Name")+'</th>\
      <th>'+tr("Group")+'</th>\
      <th>'+tr("Auth driver")+'</th>\
      <th>'+tr("VMs")+'</th>\
      <th>'+tr("Memory")+'</th>\
      <th>'+tr("CPU")+'</th>\
      <th>'+tr("Group ID")+'</th>\
    </tr>\
  </thead>\
  <tbody id="tbodyusers">\
  </tbody>\
</table>\
  </div>\
  </div>\
<div class="legend_div">\
<span>?</span>\
<p class="legend_p">\
'+
    tr("Tip: You can save any information in the user template, in the form of VAR=VAL.")+
'\
</p>\
<p class="legend_p">\
'+
    tr("Tip: SSH authentication method is not available for web UI access.")+
'\
</p>\
</div>\
</form>';

var create_user_tmpl =
'<div class="panel">\
  <h3>\
    <small id="create_vnet_header">'+tr("Create User")+'</small>\
  </h3>\
</div>\
<form id="create_user_form" action="">\
      <div class="row centered">\
          <div class="four columns">\
              <label class="inline right" for="username">'+tr("Username")+':</label>\
          </div>\
          <div class="seven columns">\
              <input type="text" name="username" id="username" />\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
      </div>\
      <div class="row centered">\
          <div class="four columns">\
              <label class="inline right" for="pass">'+tr("Password")+':</label>\
          </div>\
          <div class="seven columns">\
              <input type="password" name="pass" id="pass" />\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
      </div>\
      <div class="row centered">\
          <div class="four columns">\
              <label class="inline right" for="driver">'+tr("Authentication")+':</label>\
          </div>\
          <div class="seven columns">\
            <select name="driver" id="driver">\
                 <option value="core" selected="selected">'+tr("Core")+'</option>\
                 <option value="ssh">'+tr("SSH")+'</option>\
                 <option value="x509">'+tr("x509")+'</option>\
                 <option value="public">'+tr("Public")+'</option>\
                 <option value="custom">'+tr("Custom")+'</option>\
            </select>\
            <div>\
              <input type="text" name="custom_auth" />\
            </div>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
      </div>\
      <hr>\
      <div class="form_buttons">\
          <button class="button radius right success" id="create_user_submit" value="user/create">'+tr("Create")+'</button>\
          <button class="close-reveal-modal button secondary radius" type="button" value="close">' + tr("Close") + '</button>\
      </div>\
  <a class="close-reveal-modal">&#215;</a>\
</form>';

var update_pw_tmpl = '<div class="panel">\
  <h3>\
    <small id="create_vnet_header">'+tr("Update Password")+'</small>\
  </h3>\
</div>\
<form id="update_user_pw_form" action="">\
      <div class="row centered">\
          <div class="four columns">\
              <label class="inline right" for="new_password">'+tr("New password")+':</label>\
          </div>\
          <div class="seven columns">\
              <input type="password" name="new_password" id="new_password" />\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
      </div>\
      <hr>\
      <div class="form_buttons">\
          <button class="button radius right success" id="update_pw_submit" type="submit" value="User.update">'+tr("Change")+'</button>\
          <button class="close-reveal-modal button secondary radius" type="button" value="close">' + tr("Close") + '</button>\
      </div>\
  <a class="close-reveal-modal">&#215;</a>\
</form>';

var user_quotas_tmpl = '<div class="panel">\
  <h3>\
    <small id="create_vnet_header">'+tr("Update Quota")+'</small>\
  </h3>\
</div>\
        <div class="reveal-body">\
<form id="user_quotas_form" action="">\
  <div class="row">\
    <div class="six columns">\
     <div id="quota_types">\
           <label>'+tr("Quota type")+':</label>\
           <input type="radio" name="quota_type" value="vm">'+tr("Virtual Machine")+'</input>\
           <input type="radio" name="quota_type" value="datastore">'+tr("Datastore")+'</input>\
           <input type="radio" name="quota_type" value="image">'+tr("Image")+'</input>\
           <input type="radio" name="quota_type" value="network">'+tr("Network")+'</input>\
      </div>\
      <hr>\
      <div id="vm_quota">\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Max VMs")+':</label>\
          </div>\
          <div class="seven columns">\
            <input type="text" name="VMS"></input>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Max Memory (MB)")+':</label>\
          </div>\
          <div class="seven columns">\
            <input type="text" name="MEMORY"></input>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Max CPU")+':</label>\
          </div>\
          <div class="seven columns">\
            <input type="text" name="CPU"></input>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
      </div>\
      <div id="datastore_quota">\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Datastore")+'</label>\
          </div>\
          <div class="seven columns">\
            <select name="ID"></select>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Max size (MB)")+':</label>\
          </div>\
          <div class="seven columns">\
            <input type="text" name="SIZE"></input>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Max images")+':</label>\
          </div>\
          <div class="seven columns">\
            <input type="text" name="IMAGES"></input>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
      </div>\
      <div id="image_quota">\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Image")+'</label>\
          </div>\
          <div class="seven columns">\
            <select name="ID"></select>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Max RVMs")+'</label>\
          </div>\
          <div class="seven columns">\
            <input type="text" name="RVMS"></input>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
      </div>\
      <div id="network_quota">\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Network")+'</label>\
          </div>\
          <div class="seven columns">\
            <select name="ID"></select>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
        <div class="row">\
          <div class="four columns">\
              <label class="inline right" >'+tr("Max leases")+'</label>\
          </div>\
          <div class="seven columns">\
            <input type="text" name="LEASES"></input>\
          </div>\
          <div class="one columns">\
              <div class=""></div>\
          </div>\
        </div>\
      </div>\
      <br>\
      <button class="button right small radius" id="add_quota_button" value="add_quota">'+tr("Add/edit quota")+'</button>\
    </div>\
    <div class="six columns">\
      <div class="current_quotas">\
         <table class="datatable twelve extended_table">\
            <thead><tr>\
                 <th>'+tr("Type")+'</th>\
                 <th>'+tr("Quota")+'</th>\
                 <th>'+tr("Edit")+'</th></tr></thead>\
            <tbody>\
            </tbody>\
         </table>\
      </div>\
    </div>\
  </div>\
  <div class="reveal-footer">\
      <hr>\
      <div class="form_buttons">\
          <button class="button radius right success" id="create_user_submit" type="submit" value="User.set_quota">'+tr("Apply changes")+'</button>\
          <button class="close-reveal-modal button secondary radius" type="button" value="close">' + tr("Close") + '</button>\
      </div>\
  </div>\
  <a class="close-reveal-modal">&#215;</a>\
</form>\
  </div>';


var user_actions = {
    "User.create" : {
        type: "create",
        call: OpenNebula.User.create,
        callback: addUserElement,
        error: onError,
        notify: true
    },

    "User.create_dialog" : {
        type: "custom",
        call: popUpCreateUserDialog
    },

    "User.list" : {
        type: "list",
        call: OpenNebula.User.list,
        callback: updateUsersView,
        error: onError
    },

    "User.refresh" : {
        type: "custom",
        call: function () {
            waitingNodes(dataTable_users);
            Sunstone.runAction("User.list");
        }
    },

    "User.autorefresh" : {
        type: "custom",
        call: function(){
            OpenNebula.User.list({
                timeout: true,
                success: updateUsersView,
                error: onError
            });
        }
    },

    "User.update_password" : {
        type: "custom",
        call: popUpUpdatePasswordDialog
    },

    "User.passwd" : {
        type: "multiple",
        call: OpenNebula.User.passwd,
        callback: function(req,res){
            notifyMessage(tr("Change password successful"));
        },
        elements: userElements,
        error: onError
    },
    "User.chgrp" : {
        type: "multiple",
        call: OpenNebula.User.chgrp,
        callback : function(req){
            Sunstone.runAction("User.show",req.request.data[0][0]);
        },
        elements : userElements,
        error: onError,
        notify: true
    },

    "User.chauth" : {
        type: "multiple",
        call: OpenNebula.User.chauth,
        callback : function(req){
            Sunstone.runAction("User.show",req.request.data[0][0]);
        },
        elements: userElements,
        error: onError,
        notify: true
    },

    "User.show" : {
        type: "single",
        call: OpenNebula.User.show,
        callback: updateUserElement,
        error: onError
    },

    "User.showinfo" : {
        type: "single",
        call: OpenNebula.User.show,
        callback: updateUserInfo,
        error: onError
    },

    "User.delete" : {
        type: "multiple",
        call: OpenNebula.User.del,
        callback: deleteUserElement,
        elements: userElements,
        error: onError,
        notify: true
    },

    "User.update_template" : {
        type: "single",
        call: OpenNebula.User.update,
        callback: function(request) {
            notifyMessage(tr("Template updated correctly"));
            Sunstone.runAction('User.showinfo',request.request.data[0]);
        },
        error: onError
    },

    "User.fetch_quotas" : {
        type: "single",
        call: OpenNebula.User.show,
        callback: function (request,response) {
            // when we receive quotas we parse them and create an
            // quota objects with html code (<li>) that can be inserted
            // in the dialog
            var parsed = parseQuotas(response.USER,quotaListItem);
            $('.current_quotas table tbody',$user_quotas_dialog).append(parsed.VM);
            $('.current_quotas table tbody',$user_quotas_dialog).append(parsed.DATASTORE);
            $('.current_quotas table tbody',$user_quotas_dialog).append(parsed.IMAGE);
            $('.current_quotas table tbody',$user_quotas_dialog).append(parsed.NETWORK);
        },
        error: onError
    },

    "User.quotas_dialog" : {
        type: "custom",
        call: popUpUserQuotasDialog
    },

    "User.set_quota" : {
        type: "multiple",
        call: OpenNebula.User.set_quota,
        elements: userElements,
        callback: function() {
            notifyMessage(tr("Quotas updated correctly"));
        },
        error: onError
    },

    "User.accounting" : {
        type: "monitor",
        call: OpenNebula.User.accounting,
        callback: function(req,response) {
            var info = req.request.data[0].monitor;
            plot_graph(response,'#user_acct_tab','user_acct_', info);
        },
        error: onError
    },

    "User.help" : {
        type: "custom",
        call: function() {
            hideDialog();
            $('div#users_tab div.legend_div').slideToggle();
        }
    }
}

var user_buttons = {
    "User.refresh" : {
        type: "action",
        layout: "refresh",
        alwaysActive: true
    },
    "User.create_dialog" : {
        type: "create_dialog",
        layout: "create",
        condition: mustBeAdmin
    },
    "User.update_password" : {
        type : "action",
        layout: "more_select",
        text : tr("Change password")
    },
    "User.quotas_dialog" : {
        type : "action",
        layout: "more_select",
        text : tr("Update quotas"),
        condition: mustBeAdmin
    },
    "User.chgrp" : {
        type: "confirm_with_select",
        text: tr("Change group"),
        layout: "user_select",
        select: groups_sel,
        tip: tr("This will change the main group of the selected users. Select the new group")+":",
        condition: mustBeAdmin
    },
    "User.chauth" : {
        type: "confirm_with_select",
        text: tr("Change authentication"),
        layout: "user_select",
        //We insert our custom select there.
        select: function() {
            return   '<option value="core" selected="selected">'+tr("Core")+'</option>\
                     <option value="ssh">'+tr("SSH")+'</option>\
                     <option value="x509">'+tr("x509")+'</option>\
                     <option value="public">'+tr("Public")+'</option>'
        },
        tip: tr("Please choose the new type of authentication for the selected users")+":",
        condition: mustBeAdmin
    },
    "User.delete" : {
        type: "confirm",
        text: tr("Delete"),
        layout: "del",
        condition: mustBeAdmin
    },
};

var user_info_panel = {
    "user_info_tab" : {
        title: tr("User information"),
        content:""
    },
    "user_quotas_tab" : {
        title: tr("User quotas"),
        content:""
    },
    //"user_acct_tab" : {
    //    title: tr("Historical usages"),
    //    content: ""
    //}
};

var users_tab = {
    title: tr("Users"),
    content: users_tab_content,
    buttons: user_buttons,
    tabClass: 'subTab',
    parentTab: 'system_tab',
    condition: mustBeAdmin
};

var users_tab_non_admin = {
    title: tr("User info"),
    content: users_tab_content,
    buttons: user_buttons,
    tabClass: 'subTab',
    parentTab: 'dashboard_tab',
    condition: mustNotBeAdmin
}


SunstoneMonitoringConfig['USER'] = {
    plot: function(monitoring){
        //plot only when i am admin
        if (!mustBeAdmin()) return;

        //plot the number of total users
        $('#totalUsers', $dashboard).text(monitoring['totalUsers'])

        //if (!$dashboard.is(':visible')) return;

        //plot users per group
        var container = $('div#usersPerGroup',$dashboard);
        SunstoneMonitoring.plot('USER',
                                'usersPerGroup',
                                container,
                                monitoring['usersPerGroup']);
    },
    monitor: {
        "usersPerGroup" : {
            //we want to monitor users divided by GNAME to paint bars.
            partitionPath: "GNAME",
            operation: SunstoneMonitoring.ops.partition,
            dataType: "bars",
            plotOptions: {
                series: { bars: {show: true, barWidth: 0.5, align: 'center' }},
                xaxis: { show: true, customLabels: true },
                yaxis: { tickDecimals: 0,
                         min: 0 },
                legend : {
                    show: false,
                    noColumns: 2
                }
            }
        },
        "totalUsers" : {
            operation: SunstoneMonitoring.ops.totalize
        }
    }
}


Sunstone.addActions(user_actions);
Sunstone.addMainTab('users_tab',users_tab);
Sunstone.addMainTab('users_tab_non_admin',users_tab_non_admin);
Sunstone.addInfoPanel("user_info_panel",user_info_panel);

function userElements(){
    return getSelectedNodes(dataTable_users);
}

// Returns an array with the values from the user_json ready to be
// added to the dataTable
function userElementArray(user_json){
    var user = user_json.USER;

    var vms = "-";
    var memory = "-";
    var cpu = "-";

    if (!$.isEmptyObject(user.VM_QUOTA)){

        var vms = quotaBar(
            user.VM_QUOTA.VM.VMS_USED,
            user.VM_QUOTA.VM.VMS,
            default_user_quotas.VM_QUOTA.VM.VMS);

        var memory = quotaBarMB(
            user.VM_QUOTA.VM.MEMORY_USED,
            user.VM_QUOTA.VM.MEMORY,
            default_user_quotas.VM_QUOTA.VM.MEMORY);

        var cpu = quotaBarFloat(
            user.VM_QUOTA.VM.CPU_USED,
            user.VM_QUOTA.VM.CPU,
            default_user_quotas.VM_QUOTA.VM.CPU);
    }


    return [
        '<input class="check_item" type="checkbox" id="user_'+user.ID+'" name="selected_items" value="'+user.ID+'"/>',
        user.ID,
        user.NAME,
        user.GNAME,
        user.AUTH_DRIVER,
        vms,
        memory,
        cpu,
        user.GID
    ]
};

function updateUserSelect(){
    users_select = makeSelectOptions(dataTable_users,
                                     1,//id_col
                                     2,//name_col
                                     [],//status_cols
                                     []//bad status values
                                     );
}

// Callback to refresh a single element from the dataTable
function updateUserElement(request, user_json){
    var id = user_json.USER.ID;
    var element = userElementArray(user_json);
    updateSingleElement(element,dataTable_users,'#user_'+id);
}

// Callback to delete a single element from the dataTable
function deleteUserElement(req){
    deleteElement(dataTable_users,'#user_'+req.request.data);
    updateUserSelect();
}

// Callback to add a single user element
function addUserElement(request,user_json){
    var element = userElementArray(user_json);
    addElement(element,dataTable_users);
    updateUserSelect();
}

// Callback to update the list of users
function updateUsersView(request,users_list){
    var user_list_array = [];

    $.each(users_list,function(){
        //if (this.USER.ID == uid)
        //    dashboardQuotasHTML(this.USER);
        user_list_array.push(userElementArray(this));
    });
    updateView(user_list_array,dataTable_users);
    //SunstoneMonitoring.monitor('USER', users_list)
    //if (mustBeAdmin())
    //    updateSystemDashboard("users",users_list);
    updateUserSelect();

    $("#total_users", $dashboard).text(users_list.length);

    var form = $("#user_form");

    $("#total_users", form).text(users_list.length);
};

function updateUserInfo(request,user){
    var user_info = user.USER;

    var info_tab = {
        title : tr("User information"),
        content :
        '<div class="">\
          <div class="six columns">\
          <table id="info_user_table" class="twelve datatable extended_table">\
            <thead>\
               <tr><th colspan="2">' + tr("User") + ' - '+user_info.NAME+'</th><th></th></tr>\
            </thead>\
            <tbody>\
            <tr>\
                <td class="key_td">' + tr("ID") + '</td>\
                <td class="value_td">'+user_info.ID+'</td>\
                <td></td>\
            </tr>\
            <tr>' +
                insert_group_dropdown("User",user_info.ID,user_info.GNAME,user_info.GID) +
            '</tr>\
            <tr>\
                <td class="key_td">' + tr("Authentication driver") + '</td>\
                <td class="value_td">'+user_info.AUTH_DRIVER+'</td>\
                <td></td>\
            </tr>\
            </tbody>\
         </table>\
       </div>\
       <div class="six columns">' +
               insert_extended_template_table(user_info.TEMPLATE,
                                              "User",
                                              user_info.ID,
                                              tr("Configuration Attributes")) +
       '</div>\
     </div>'
    };

    var quotas_tab_html = '<div class="">';

    if (!$.isEmptyObject(user_info.VM_QUOTA)){
        var vms_bar = quotaBar(
            user_info.VM_QUOTA.VM.VMS_USED,
            user_info.VM_QUOTA.VM.VMS,
            default_user_quotas.VM_QUOTA.VM.VMS);

        var memory_bar = quotaBarMB(
            user_info.VM_QUOTA.VM.MEMORY_USED,
            user_info.VM_QUOTA.VM.MEMORY,
            default_user_quotas.VM_QUOTA.VM.MEMORY);

        var cpu_bar = quotaBarFloat(
            user_info.VM_QUOTA.VM.CPU_USED,
            user_info.VM_QUOTA.VM.CPU,
            default_user_quotas.VM_QUOTA.VM.CPU);

        quotas_tab_html +=
        '<div class="six columns">\
        <table class="twelve datatable extended_table">\
            <thead>\
                <tr>\
                    <th>'+tr("VMs")+'</th>\
                    <th>'+tr("Memory")+'</th>\
                    <th>'+tr("CPU")+'</th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr>\
                    <td style="height:25px">'+vms_bar+'</td>\
                    <td>'+memory_bar+'</td>\
                    <td>'+cpu_bar+'</td>\
                </tr>\
            </tbody>\
        </table>\
     </div>'
    }

    if (!$.isEmptyObject(user_info.DATASTORE_QUOTA)){
        quotas_tab_html +=
        '<div class="six columns">\
        <table class="twelve datatable extended_table">\
            <thead>\
                <tr>\
                    <th style="width:24%">'+tr("Datastore ID")+'</th>\
                    <th style="width:38%">'+tr("Images")+'</th>\
                    <th style="width:38%">'+tr("Size")+'</th>\
                </tr>\
            </thead>\
            <tbody>';

        var ds_quotas = [];

        if ($.isArray(user_info.DATASTORE_QUOTA.DATASTORE))
            ds_quotas = user_info.DATASTORE_QUOTA.DATASTORE;
        else if (user_info.DATASTORE_QUOTA.DATASTORE.ID)
            ds_quotas = [user_info.DATASTORE_QUOTA.DATASTORE];

        for (var i=0; i < ds_quotas.length; i++){

            var default_ds_quotas = default_user_quotas.DATASTORE_QUOTA[ds_quotas[i].ID]

            if (default_ds_quotas == undefined){
                default_ds_quotas = {
                    "IMAGES"    : "0",
                    "SIZE"      : "0"
                }
            }

            var img_bar = quotaBar(
                ds_quotas[i].IMAGES_USED,
                ds_quotas[i].IMAGES,
                default_ds_quotas.IMAGES);

            var size_bar = quotaBarMB(
                ds_quotas[i].SIZE_USED,
                ds_quotas[i].SIZE,
                default_ds_quotas.SIZE);

            quotas_tab_html +=
            '<tr>\
                <td>'+ds_quotas[i].ID+'</td>\
                <td>'+img_bar+'</td>\
                <td>'+size_bar+'</td>\
            </tr>';
        }

        quotas_tab_html +=
            '</tbody>\
        </table>\
     </div>';
    }

    if (!$.isEmptyObject(user_info.IMAGE_QUOTA)){
        quotas_tab_html +=
        '<div class="six columns">\
        <table class="twelve datatable extended_table">\
            <thead>\
                <tr>\
                    <th>'+tr("Image ID")+'</th>\
                    <th>'+tr("Running VMs")+'</th>\
                </tr>\
            </thead>\
            <tbody>';

        var img_quotas = [];

        if ($.isArray(user_info.IMAGE_QUOTA.IMAGE))
            img_quotas = user_info.IMAGE_QUOTA.IMAGE;
        else if (user_info.IMAGE_QUOTA.IMAGE.ID)
            img_quotas = [user_info.IMAGE_QUOTA.IMAGE];

        for (var i=0; i < img_quotas.length; i++){

            var default_img_quotas = default_user_quotas.IMAGE_QUOTA[img_quotas[i].ID]

            if (default_img_quotas == undefined){
                default_img_quotas = {
                    "RVMS"  : "0"
                }
            }

            var rvms_bar = quotaBar(
                img_quotas[i].RVMS_USED,
                img_quotas[i].RVMS,
                default_img_quotas.RVMS);

            quotas_tab_html +=
            '<tr>\
                <td>'+img_quotas[i].ID+'</td>\
                <td>'+rvms_bar+'</td>\
            </tr>';
        }

        quotas_tab_html +=
            '</tbody>\
        </table>\
     </div>';
    }

    if (!$.isEmptyObject(user_info.NETWORK_QUOTA)){
        quotas_tab_html +=
        '<div class="six columns">\
        <table class="twelve datatable extended_table">\
            <thead>\
                <tr>\
                    <th>'+tr("Network ID")+'</th>\
                    <th>'+tr("Leases")+'</th>\
                </tr>\
            </thead>\
            <tbody>';

        var net_quotas = [];

        if ($.isArray(user_info.NETWORK_QUOTA.NETWORK))
            net_quotas = user_info.NETWORK_QUOTA.NETWORK;
        else if (user_info.NETWORK_QUOTA.NETWORK.ID)
            net_quotas = [user_info.NETWORK_QUOTA.NETWORK];

        for (var i=0; i < net_quotas.length; i++){

            var default_net_quotas = default_user_quotas.NETWORK_QUOTA[net_quotas[i].ID]

            if (default_net_quotas == undefined){
                default_net_quotas = {
                    "LEASES" : "0"
                }
            }

            var leases_bar = quotaBar(
                net_quotas[i].LEASES_USED,
                net_quotas[i].LEASES,
                default_net_quotas.LEASES);

            quotas_tab_html +=
            '<tr>\
                <td>'+net_quotas[i].ID+'</td>\
                <td>'+leases_bar+'</td>\
            </tr>';
        }

        quotas_tab_html +=
            '</tbody>\
        </table></div>\
     </div>';
    }

    var quotas_tab = {
        title : tr("Quotas"),
        content : quotas_tab_html
    };

//    var acct_tab = {
//        title : tr("Historical usages"),
//        content : '<div><table class="info_table" style="margin-bottom:0;width:100%">\
//  <tr>\
//    <td class="key_td"><label for="from">'+tr('From / to')+'</label></td>\
//    <td class="value_td">\
//       <input style="width: 7em" type="text" id="user_acct_from" name="from"/>\
//       <input style="width: 7em" type="text" id="user_acct_to" name="to"/>\
//       <button id="user_acct_date_ok">'+tr("Update")+'</button>\
//    </td>\
//  </tr>\
//<!--\
//  <tr>\
//    <td class="key_td"><label for="from">'+tr('Meters')+'</label></td>\
//    <td class="value_td">\
//       <select style="width:173px" id="user_acct_meter1" name="meter1">\
//       </select>\
//       <select style="width:173px" id="user_acct_meter2" name="meter2">\
//       </select>\
//    </td>\
//  </tr>\
//-->\
//</table></div>' + generateMonitoringDivs(user_acct_graphs, "user_acct_")
//    };

    Sunstone.updateInfoPanelTab("user_info_panel","user_info_tab",info_tab);
    Sunstone.updateInfoPanelTab("user_info_panel","user_quotas_tab",quotas_tab);
    //Sunstone.updateInfoPanelTab("user_info_panel","user_acct_tab",acct_tab);
    Sunstone.popUpInfoPanel("user_info_panel");

    //Enable datepicker
    //var info_dialog = $('div#user_acct_tab');
    //$("#user_acct_from", info_dialog).datepicker({
    //    defaultDate: "-1d",
    //    changeMonth: true,
    //    numberOfMonths: 1,
    //    dateFormat: "dd/mm/yy",
    //    defaultDate: '-1',
    //    onSelect: function( selectedDate ) {
    //        $( "#user_acct_to", info_dialog).datepicker("option",
    //                                                    "minDate",
    //                                                    selectedDate );
    //    }
    //});
    //$("#user_acct_from", info_dialog).datepicker('setDate', '-1');
//
    //$("#user_acct_to", info_dialog).datepicker({
    //    defaultDate: "0",
    //    changeMonth: true,
    //    numberOfMonths: 1,
    //    dateFormat: "dd/mm/yy",
    //    maxDate: '+1',
    //    onSelect: function( selectedDate ) {
    //        $( "#user_acct_from", info_dialog).datepicker( "option",
    //                                                       "maxDate",
    //                                                       selectedDate );
    //    }
    //});
    //$("#user_acct_to", info_dialog).datepicker('setDate', 'Now');
//
    ////Listen to set date button
    //$('button#user_acct_date_ok', info_dialog).click(function(){
    //    var from = $("#user_acct_from", info_dialog).val();
    //    var to = $("#user_acct_to", info_dialog).val();
//
    //    var start = $.datepicker.parseDate('dd/mm/yy', from)
    //    if (start){
    //        start = start.getTime();
    //        start = Math.floor(start / 1000);
    //    }
//
    //    var end = $.datepicker.parseDate('dd/mm/yy', to);
    //    if (end){
    //        end = end.getTime();
    //        end = Math.floor(end / 1000);
    //    }
//
    //    loadAccounting('User', user_info.ID, user_acct_graphs,
    //              { start : start, end: end });
    //    return false;
    //});
//
    ////preload acct
    //loadAccounting('User', user_info.ID, user_acct_graphs);
};

// Prepare the user creation dialog
function setupCreateUserDialog(){
    dialogs_context.append('<div title=\"'+tr("Create user")+'\" id="create_user_dialog"></div>');
    $create_user_dialog = $('#create_user_dialog',dialogs_context);
    var dialog = $create_user_dialog;
    dialog.html(create_user_tmpl);

    //Prepare jquery dialog
    //dialog.dialog({
    //    autoOpen: false,
    //    modal:true,
    //    width: 400
    //});

    dialog.addClass("reveal-modal");

    //$('button',dialog).button();

    $('input[name="custom_auth"]',dialog).parent().hide();
    $('select#driver').change(function(){
        if ($(this).val() == "custom")
            $('input[name="custom_auth"]',dialog).parent().show();
        else
            $('input[name="custom_auth"]',dialog).parent().hide();
    });


    $('#create_user_form',dialog).submit(function(){
        var user_name=$('#username',this).val();
        var user_password=$('#pass',this).val();
        var driver = $('#driver', this).val();
        if (driver == 'custom')
            driver = $('input[name="custom_auth"]').val();

        if (!user_name.length || !user_password.length){
            notifyError(tr("User name and password must be filled in"));
            return false;
        };

        var user_json = { "user" :
                          { "name" : user_name,
                            "password" : user_password,
                            "auth_driver" : driver
                          }
                        };
        Sunstone.runAction("User.create",user_json);
        $create_user_dialog.trigger("reveal:close")
        return false;
    });
}

function setupUpdatePasswordDialog(){
    dialogs_context.append('<div title="'+tr("Change password")+'" id="update_user_pw_dialog"></div>');
    $update_pw_dialog = $('#update_user_pw_dialog',dialogs_context);
    var dialog = $update_pw_dialog;
    dialog.html(update_pw_tmpl);

    dialog.addClass("reveal-modal");

    $('#update_user_pw_form',dialog).submit(function(){
        var pw=$('#new_password',this).val();

        if (!pw.length){
            notifyError(tr("Fill in a new password"));
            return false;
        }

        Sunstone.runAction("User.passwd",getSelectedNodes(dataTable_users),pw);
        $update_pw_dialog.trigger("reveal:close")
        return false;
    });
};


//add a setup quota dialog and call the sunstone-util.js initialization
function setupUserQuotasDialog(){
    dialogs_context.append('<div title="'+tr("User quotas")+'" id="user_quotas_dialog"></div>');
    $user_quotas_dialog = $('#user_quotas_dialog',dialogs_context);
    var dialog = $user_quotas_dialog;
    dialog.html(user_quotas_tmpl);

    setupQuotasDialog(dialog);
}

function popUpUserQuotasDialog(){
    popUpQuotasDialog($user_quotas_dialog, 'User', userElements())
}

function popUpCreateUserDialog(){
    $create_user_dialog.reveal();

}


function popUpUpdatePasswordDialog(){
    $('#new_password',$update_pw_dialog).val("");
    $update_pw_dialog.reveal();
}

// Prepare the autorefresh of the list
function setUserAutorefresh(){
    setInterval(function(){
        var checked = $('input.check_item:checked',dataTable_users);
        var filter = $("#user_search").attr('value');
        if (!checked.length && !filter.length){
            Sunstone.runAction("User.autorefresh");
        }
    },INTERVAL+someTime());
}

$(document).ready(function(){
    //if we are not oneadmin, our tab will not even be in the DOM.
    dataTable_users = $("#datatable_users",main_tabs_context).dataTable({
        "oColVis": {
            "aiExclude": [ 0 ]
        },
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": ["check"] },
            { "sWidth": "35px", "aTargets": [0,1] },
            { "bVisible": false, "aTargets": [8]}
        ]
    });

    $('#user_search').keyup(function(){
      dataTable_users.fnFilter( $(this).val() );
    })

    Sunstone.runAction("User.list");

    setupCreateUserDialog();
    setupUpdatePasswordDialog();
    setupUserQuotasDialog();
    setUserAutorefresh();
    //Setup quota icons
    //Also for group tab
    setupQuotaIcons();

    initCheckAllBoxes(dataTable_users);
    tableCheckboxesListener(dataTable_users);
    infoListener(dataTable_users,'User.showinfo');

    $('div#users_tab div.legend_div').hide();
    $('div#users_tab_non_admin div.legend_div').hide();
});
