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

#ifndef HISTORY_H_
#define HISTORY_H_

#include "ObjectSQL.h"

using namespace std;

/**
 *  The History class, it represents an execution record of a Virtual Machine.
 */

class History:public ObjectSQL, public ObjectXML
{
public:
    enum EndReason
    {
        NONE,       /** < History record is not closed yet */
        ERROR,      /** < History record was closed because of an error */
        USER        /** < History record was closed because of a user action */
    };

    enum VMAction
    {
        NONE_ACTION,
        MIGRATE_ACTION,
        LIVE_MIGRATE_ACTION,
        SHUTDOWN_ACTION,
        SHUTDOWN_HARD_ACTION,
        UNDEPLOY_ACTION,
        UNDEPLOY_HARD_ACTION,
        HOLD_ACTION,
        RELEASE_ACTION,
        STOP_ACTION,
        SUSPEND_ACTION,
        RESUME_ACTION,
        BOOT_ACTION,
        DESTROY_ACTION,
        DESTROY_RECREATE_ACTION,
        REBOOT_ACTION,
        REBOOT_HARD_ACTION,
        RESCHED_ACTION,
        UNRESCHED_ACTION,
        POWEROFF_ACTION,
        POWEROFF_HARD_ACTION
    };

    static string action_to_str(VMAction action)
    {
        string st;

        switch (action)
        {
            case MIGRATE_ACTION:
                st = "migrate";
            break;
            case LIVE_MIGRATE_ACTION:
                st = "live-migrate";
            break;
            case SHUTDOWN_ACTION:
                st = "shutdown";
            break;
            case SHUTDOWN_HARD_ACTION:
                st = "shutdown-hard";
            break;
            case UNDEPLOY_ACTION:
                st = "undeploy";
            break;
            case UNDEPLOY_HARD_ACTION:
                st = "undeploy-hard";
            break;
            case HOLD_ACTION:
                st = "hold";
            break;
            case RELEASE_ACTION:
                st = "release";
            break;
            case STOP_ACTION:
                st = "stop";
            break;
            case SUSPEND_ACTION:
                st = "suspend";
            break;
            case RESUME_ACTION:
                st = "resume";
            break;
            case BOOT_ACTION:
                st = "boot";
            break;
            case DESTROY_ACTION:
                st = "destroy";
            break;
            case DESTROY_RECREATE_ACTION:
                st = "destroy-recreate";
            break;
            case REBOOT_ACTION:
                st = "reboot";
            break;
            case REBOOT_HARD_ACTION:
                st = "reboot-hard";
            break;
            case RESCHED_ACTION:
                st = "resched";
            break;
            case UNRESCHED_ACTION:
                st = "unresched";
            break;
            case POWEROFF_ACTION:
                st = "poweroff";
            break;
            case POWEROFF_HARD_ACTION:
                st = "poweroff-hard";
            break;
            case NONE_ACTION:
                st = "none";
            break;
        }

        return st;
    };

    static int action_from_str(string& st, VMAction& action)
    {
        if (st == "migrate")
        {
            action = MIGRATE_ACTION;
        }
        else if (st == "live-migrate")
        {
            action = LIVE_MIGRATE_ACTION;
        }
        else if (st == "shutdown")
        {
            action = SHUTDOWN_ACTION;
        }
        else if (st == "shutdown-hard")
        {
            action = SHUTDOWN_HARD_ACTION;
        }
        else if (st == "undeploy")
        {
            action = UNDEPLOY_ACTION;
        }
        else if (st == "undeploy-hard")
        {
            action = UNDEPLOY_HARD_ACTION;
        }
        else if (st == "hold")
        {
            action = HOLD_ACTION;
        }
        else if (st == "release")
        {
            action = RELEASE_ACTION;
        }
        else if (st == "stop")
        {
            action = STOP_ACTION;
        }
        else if (st == "suspend")
        {
            action = SUSPEND_ACTION;
        }
        else if (st == "resume")
        {
            action = RESUME_ACTION;
        }
        else if (st == "boot")
        {
            action = BOOT_ACTION;
        }
        else if (st == "destroy")
        {
            action = DESTROY_ACTION;
        }
        else if (st == "destroy-recreate")
        {
            action = DESTROY_RECREATE_ACTION;
        }
        else if (st == "reboot")
        {
            action = REBOOT_ACTION;
        }
        else if (st == "reboot-hard")
        {
            action = REBOOT_HARD_ACTION;
        }
        else if (st == "resched")
        {
            action = RESCHED_ACTION;
        }
        else if (st == "unresched")
        {
            action = UNRESCHED_ACTION;
        }
        else if (st == "poweroff")
        {
            action = POWEROFF_ACTION;
        }
        else if (st == "poweroff-hard")
        {
            action = POWEROFF_HARD_ACTION;
        }
        else
        {
            action = NONE_ACTION;
            return -1;
        }

        return 0;
    };

    History(int oid, int _seq = -1);

    History(
        int oid,
        int seq,
        int hid,
        const string& hostname,
        const string& vmm,
        const string& vnm,
        const string& tmm,
        const string& ds_location,
        int           ds_id,
        const string& vm_info);

    ~History(){};

    /**
     *  Function to write the History Record in an output stream
     */
    friend ostream& operator<<(ostream& os, const History& history);

    /**
     * Function to print the History object into a string in
     * XML format
     *  @param xml the resulting XML string
     *  @return a reference to the generated string
     */
    string& to_xml(string& xml) const;

private:
    friend class VirtualMachine;
    friend class VirtualMachinePool;

    // ----------------------------------------
    // DataBase implementation variables
    // ----------------------------------------
    static const char * table;

    static const char * db_names;

    static const char * db_bootstrap;

    void non_persistent_data();

    // ----------------------------------------
    // History fields
    // ----------------------------------------
    int     oid;
    int     seq;

    string  hostname;
    int     hid;

    string  vmm_mad_name;
    string  vnm_mad_name;
    string  tm_mad_name;

    string  ds_location;
    int     ds_id;

    time_t  stime;
    time_t  etime;

    time_t  prolog_stime;
    time_t  prolog_etime;

    time_t  running_stime;
    time_t  running_etime;

    time_t  epilog_stime;
    time_t  epilog_etime;

    EndReason reason;

    VMAction action;

    string  vm_info;

    // -------------------------------------------------------------------------
    // Non-persistent history fields
    // -------------------------------------------------------------------------
    // Local paths
    string  transfer_file;
    string  deployment_file;
    string  context_file;

    // Remote paths
    string  checkpoint_file;
    string  rdeployment_file;
    string  rsystem_dir;

    /**
     *  Writes the history record in the DB
     *    @param db pointer to the database.
     *    @return 0 on success.
     */
    int insert(SqlDB * db, string& error_str)
    {
        error_str.clear();

        return insert_replace(db, false);
    }

    /**
     *  Reads the history record from the DB
     *    @param db pointer to the database.
     *    @return 0 on success.
     */
    int select(SqlDB * db);

    /**
     *  Updates the history record
     *    @param db pointer to the database.
     *    @return 0 on success.
     */
     int update(SqlDB * db)
     {
        return insert_replace(db, true);
     }

    /**
     *  Removes the all history records from the DB
     *    @param db pointer to the database.
     *    @return 0 on success.
     */
    int drop(SqlDB * db);

    /**
     *  Execute an INSERT or REPLACE Sql query.
     *    @param db The SQL DB
     *    @param replace Execute an INSERT or a REPLACE
     *    @return 0 on success
     */
    int insert_replace(SqlDB *db, bool replace);

    /**
     *  Callback function to unmarshall a history object (History::select)
     *    @param num the number of columns read from the DB
     *    @para names the column names
     *    @para vaues the column values
     *    @return 0 on success
     */
    int select_cb(void *nil, int num, char **values, char **names);

    /**
     * Function to print the History object into a string in
     * XML format, to be stored in the DB. It includes the VM template info
     *  @param xml the resulting XML string
     *  @return a reference to the generated string
     */
    string& to_db_xml(string& xml) const;

    /**
     * Function to print the History object into a string in
     * XML format. The VM info can be optionally included
     *  @param xml the resulting XML string
     *  @param database If it is true, the TEMPLATE element will be included
     *  @return a reference to the generated string
     */
    string& to_xml(string& xml, bool database) const;

    /**
     *  Rebuilds the object from an xml node
     *    @param node The xml node pointer
     *
     *    @return 0 on success, -1 otherwise
     */
    int from_xml_node(const xmlNodePtr node)
    {
        ObjectXML::update_from_node(node);

        return rebuild_attributes();
    }

    /**
     *  Rebuilds the object from an xml formatted string
     *    @param xml_str The xml-formatted string
     *
     *    @return 0 on success, -1 otherwise
     */
    int from_xml(const string &xml_str)
    {
        ObjectXML::update_from_str(xml_str);

        return rebuild_attributes();
    }

    /**
     *  Rebuilds the internal attributes using xpath
     */
    int rebuild_attributes();
};

#endif /*HISTORY_H_*/

